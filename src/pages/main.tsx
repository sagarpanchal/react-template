import { Link } from "react-router-dom"

export const MainPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-gray-100 text-gray-800">
      <Link to="/calculator" className="px-2 py-1 underline hover:bg-lime-300">
        Calculator
      </Link>
      <Link to="/breadcrumb" className="px-2 py-1 underline hover:bg-lime-300">
        Breadcrumb
      </Link>
    </div>
  )
}
