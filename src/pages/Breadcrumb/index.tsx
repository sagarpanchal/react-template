import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/Breadcrumb"

// Example usage
export const BreadcrumbPage = () => {
  return (
    <Breadcrumb separator={<span className="mx-2">|</span>} className="p-3">
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Docs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">Breadcrumb</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
