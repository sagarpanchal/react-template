import React from "react"

import { Toaster } from "react-hot-toast"
import { useStore } from "zustand"

import { useAbortController } from "../hooks/useAbortController"
import { AuthService } from "../services/AuthService"

export function OAuthCallback() {
  const getAbortSignal = useAbortController()

  const isLoggedIn = useStore(AuthService.store, (state) => AuthService._selectIsLoggedIn(state))

  React.useEffect(() => {
    if (isLoggedIn) return
    AuthService.signInWithTokenAndPostToParent(getAbortSignal())
  }, [getAbortSignal, isLoggedIn])

  return <Toaster />
}
