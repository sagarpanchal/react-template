import ky, { NormalizedOptions, ResponsePromise } from "ky"

import { AuthService } from "./AuthService"

export class ApiService {
  static readonly client = ky.extend({
    headers: { "Content-Type": "application/json" },
    hooks: {
      afterResponse: [ApiService.kyAfterResponseHook],
      beforeRequest: [ApiService.kyBeforeRequestHook],
    },
    retry: {
      limit: 4,
      methods: ["get", "put", "head", "delete"], // 'options', 'trace'
      statusCodes: [400, 408, 413, 429, 500, 502, 503, 504],
      afterStatusCodes: [413, 429, 503],
      maxRetryAfter: 5,
      backoffLimit: 2,
      delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1000,
    },
    throwHttpErrors: false,
  })

  private static async kyBeforeRequestHook(_request: Request) {
    if (AuthService.token) _request.headers.set("Authorization", `Bearer ${AuthService.token}`)
  }

  private static async kyAfterResponseHook(_request: Request, _options: NormalizedOptions, response: Response) {
    if (response.status === 401 && AuthService.isLoggedIn) {
      await AuthService.refreshTokens()
    }
  }

  static readonly get = ApiService.client.get
  static readonly post = ApiService.client.post
  static readonly put = ApiService.client.put
  static readonly delete = ApiService.client.delete
  static readonly patch = ApiService.client.patch
  static readonly head = ApiService.client.head

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
}
