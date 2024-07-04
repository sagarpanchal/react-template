import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { BreadcrumbPage } from "./pages/Breadcrumb"
import { CalculatorPage } from "./pages/Calculator"
import { MainPage } from "./pages/main"

const router = createBrowserRouter([
  { path: "/", Component: MainPage },
  { path: "/breadcrumb", Component: BreadcrumbPage },
  { path: "/calculator", Component: CalculatorPage },
])

export default function App() {
  if (typeof window !== "undefined") {
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark")
  }

  return <RouterProvider router={router} />
}
