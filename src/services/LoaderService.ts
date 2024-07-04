import { createStore } from "zustand"

import { chain } from "../utils/chain"

export class LoaderService {
  static readonly store = createStore(() => 0)
  private static subscriptions: (() => void)[] = []

  static get isLoading() {
    return LoaderService.store.getState() > 0
  }

  static get startLoading() {
    return LoaderService.store.setState(
      chain(LoaderService.store.getState() + 1)
        .call((count) => (count < 1 ? 1 : count))
        .result(),
    )
  }

  static get stopLoading() {
    return LoaderService.store.setState(
      chain(LoaderService.store.getState() - 1)
        .call((count) => (count < 0 ? 0 : count))
        .result(),
    )
  }

  static set adjustCount(count: number) {
    LoaderService.store.setState(LoaderService.store.getState() + count)
  }

  public static init() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (!document.getElementById("cursor-progress")) {
        chain(document.createElement("style"))
          .call((style) => (style.id = "cursor-progress"))
          .call((style) => (style.innerHTML = `.cursor-progress { cursor: progress; }`))
          .call((style) => document.head.appendChild(style))
      }
    }

    LoaderService.dispose()
    LoaderService.subscriptions = [
      LoaderService.store.subscribe((count) => {
        if (count < 0) LoaderService.store.setState(0)

        if (typeof window !== "undefined" && typeof document !== "undefined") {
          const hasClass = document.body.classList.contains("cursor-progress")
          count > 0
            ? !hasClass && document.body.classList.add("cursor-progress")
            : hasClass && document.body.classList.remove("cursor-progress")
        }
      }),
    ]
  }

  public static dispose() {
    LoaderService.subscriptions.forEach((unsubscribe) => unsubscribe())
  }
}
