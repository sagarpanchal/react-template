import { toast } from "react-hot-toast"
import { createStore } from "zustand"

import isNetworkError from "is-network-error"
import ky, { HTTPError, KyResponse, NormalizedOptions, ResponsePromise } from "ky"
import { z } from "zod"
import { subscribeWithSelector } from "zustand/middleware"

import { StorageService } from "./StorageService"

import { User } from "../types/user"
import { catchError } from "../utils/catchError"
import { combineUrl } from "../utils/combineUrl"
import { isEmpty } from "../utils/isEmpty"
import { isString } from "../utils/isString"
import { subscribeToGlobalEvent } from "../utils/subscribeToGlobalEvent"

export class AuthService {
  private static readonly INITIAL_STATE = {
    user: undefined as User | undefined,
    token: undefined as string | undefined,
    refreshToken: undefined as string | undefined,
  }

  static readonly store = createStore(
    subscribeWithSelector(() => ({
      user: StorageService.get<User>("user"),
      token: StorageService.get<string>("token"),
      refreshToken: StorageService.get<string>("refreshToken"),
    })),
  )

  private static subscriptions: (() => void)[] = []

  static clearStore() {
    AuthService.store.setState({ ...AuthService.INITIAL_STATE }, true)
  }

  static set user(user: User | undefined) {
    AuthService.store.setState({ user })
  }

  static get user() {
    return AuthService.store.getState().user
  }

  static set token(token: string | undefined) {
    AuthService.store.setState({ token })
  }

  static get token() {
    return AuthService.store.getState().token
  }

  static set refreshToken(refreshToken: string | undefined) {
    AuthService.store.setState({ refreshToken })
  }

  static get refreshToken() {
    return AuthService.store.getState().refreshToken
  }

  static get isLoggedIn() {
    return AuthService._selectIsLoggedIn(AuthService.store.getState())
  }

  static _selectIsLoggedIn(state: typeof AuthService.INITIAL_STATE) {
    return !isEmpty(state.user) && !isEmpty(state.token) && !isEmpty(state.refreshToken)
  }

  private static HOST_URL = ""
  static get ENDPOINTS() {
    return {
      SIGN_IN: combineUrl(AuthService.HOST_URL, "sign-in"),
      REFRESH: combineUrl(AuthService.HOST_URL, "refresh"),
      SIGN_OUT: combineUrl(AuthService.HOST_URL, "sign-out"),
    } as const
  }

  private static readonly client = ky.create({
    headers: { "Content-Type": "application/json" },
    hooks: {
      afterResponse: [AuthService.kyAfterResponseHook],
    },
    retry: 0,
    throwHttpErrors: false,
  })

  private static async kyAfterResponseHook(_request: Request, _options: NormalizedOptions, response: Response) {
    if (response.status === 401 && AuthService.isLoggedIn) {
      AuthService.clearStore()
    }
  }

  public static _handleHttpErrors(
    error: any,
    options?: {
      showErrorToast?: boolean
    },
  ): [undefined, any] | undefined {
    const showErrorToast = options?.showErrorToast ?? true

    switch (true) {
      case error === "Re-render": {
        return [undefined, error]
      }

      case isNetworkError(error): {
        showErrorToast && toast.error("Network error!")
        return [undefined, error]
      }

      case error instanceof HTTPError: {
        showErrorToast && toast.error("Something went wrong!")
        return [undefined, error]
      }

      case isString(error?.message): {
        showErrorToast && toast.error(error.message)
        return [undefined, error]
      }

      default: {
        return [undefined, error]
      }
    }
  }

  public static async _getResponseOrError(callback: () => ResponsePromise) {
    return await catchError(
      async () => [await callback(), undefined] as const,
      (error) => [undefined, error] as const,
    )
  }

  public static async _getResponseJson<S>(response: KyResponse | undefined) {
    if (!response) return
    return catchError(() => response.json())?.then((data) => data as S)
  }

  /**
   * Handles errors and responses from the API
   * @param callback
   * @returns response if it succeeded
   */
  /**
   * Handles HTTP errors from the API
   * @param callback
   * @returns response if it succeeded
   */
  static async handleHttpErrors(
    callback: () => ResponsePromise,
    options?: {
      showErrorToast?: boolean
    },
  ) {
    const [response, error] = await AuthService._getResponseOrError(callback)
    const errorResponse = AuthService._handleHttpErrors(error, options)
    return errorResponse ?? [response, undefined]
  }

  static async refreshTokens(abortSignal?: AbortSignal) {
    const [response] = await AuthService.handleHttpErrors(() =>
      AuthService.client.post(AuthService.ENDPOINTS.REFRESH, {
        json: { refreshToken: `JWT ${AuthService.refreshToken}` },
        signal: abortSignal,
      }),
    )

    if (response) {
      // AuthService.token = <FROM_RESPONSE>
      // AuthService.refreshToken = <FROM_RESPONSE>
    }
  }

  private static EVENTS = {
    SIGN_IN: "SIGN_IN",
  }

  static storeSignInResponse(response: unknown) {
    // AuthService.user = <FROM_RESPONSE>
    // AuthService.token = <FROM_RESPONSE>
    // AuthService.refreshToken = <FROM_RESPONSE>

    return response
  }

  static async signInWithTokenAndPostToParent(abortSignal?: AbortSignal) {
    const [response] = await AuthService.signIn(abortSignal)

    catchError(() => {
      ;(window.opener ?? window.parent).postMessage(
        {
          type: AuthService.EVENTS.SIGN_IN,
          payload: { _: StorageService.encrypt(new Date().toISOString().split("T")[0]), response },
        },
        "*",
      )

      setTimeout(() => window.close(), 500)
    })
  }

  static async openOAuthPopup(url: string) {
    const popup = window.open(
      url,
      "popup",
      `scrollbars=yes,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=800,height=600,left=128,top=128`,
    )
    if (!popup) return

    while (!popup.closed) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  static async signIn(abortSignal?: AbortSignal) {
    const [response] = await AuthService.handleHttpErrors(() =>
      AuthService.client.get(AuthService.ENDPOINTS.SIGN_IN, { signal: abortSignal }),
    )

    if (response) {
      AuthService.storeSignInResponse(response)
    }

    return [response]
  }

  static async signOut() {
    if (!AuthService.isLoggedIn) return

    const headers = { Authorization: `JWT ${AuthService.token}` }

    StorageService.clear()
    AuthService.clearStore()

    const response = await AuthService.handleHttpErrors(() =>
      AuthService.client.get(AuthService.ENDPOINTS.SIGN_OUT, { headers }),
    )

    return response
  }

  public static onLogIn(callback: () => void) {
    const removeSubscription = AuthService.store.subscribe(
      (state) => AuthService._selectIsLoggedIn(state),
      (isLoggedIn) => void (isLoggedIn && callback()),
      { fireImmediately: true },
    )
    return removeSubscription
  }

  public static onLogOut(callback: () => void) {
    const removeSubscription = AuthService.store.subscribe(
      (state) => AuthService._selectIsLoggedIn(state),
      (isLoggedIn) => void (!isLoggedIn && callback()),
      { fireImmediately: true },
    )
    return removeSubscription
  }

  private static oAuthCallbackEventHandler(event: MessageEvent) {
    // return-early if the event is not a sign in event
    if (event.data?.type !== AuthService.EVENTS.SIGN_IN) return

    // decrypt the token and compare it with the current date
    const token = StorageService.decrypt(event.data?.payload?._)
    // return-early if the token is not valid
    if (token !== new Date().toISOString().split("T")[0]) return

    // store the sign in response
    AuthService.storeSignInResponse(event.data?.payload?.response)

    // // return from auth page
    // window.location.href = chain(new URL(window.location.href))
    //   .call((o) => removeUrlHash(o))
    //   .call((o) => removeUrlQueryString(o))
    //   .call((o) => popUrlPathSegment(o))
    //   .object().href
  }

  public static setHostUrl(hostUrl: any) {
    AuthService.HOST_URL = z.string().parse(hostUrl)
    return AuthService
  }

  public static getHostUrl() {
    return AuthService.HOST_URL
  }

  public static init() {
    AuthService.dispose()
    AuthService.subscriptions = [
      AuthService.store.subscribe((state) => {
        if (typeof window === "undefined") return

        Object.entries(state).forEach(([key, value]) => {
          isEmpty(value) ? StorageService.remove(key) : StorageService.set(key, value)
        })
      }),
      subscribeToGlobalEvent("message", AuthService.oAuthCallbackEventHandler),
    ]
  }

  public static dispose() {
    AuthService.subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}
