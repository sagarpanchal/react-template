import React from "react"

const styles: Record<string, React.CSSProperties> = {
  item: { alignItems: "center", display: "inline-flex", gap: "inherit" },
  list: { alignItems: "center", display: "flex", gap: "inherit", listStyle: "none", wordWrap: "break-word" },
}

const BreadcrumbContext = React.createContext({ separator: null as React.ReactNode })
const useBreadcrumbContext = () => {
  const context = React.useContext(BreadcrumbContext)
  if (!context) throw new Error("BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator must be used within a Breadcrumb")
  return context
}

const BreadcrumbItemContext = React.createContext({ isCurrent: false, isLast: false })
const useBreadcrumbItemContext = () => {
  const context = React.useContext(BreadcrumbItemContext)
  if (!context) throw new Error("BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator must be used within a Breadcrumb")
  return context
}

type BreadcrumbSeparatorProps = Omit<React.ComponentPropsWithoutRef<"span">, "children">
function BreadcrumbSeparator(props: BreadcrumbSeparatorProps): JSX.Element | null {
  const { separator } = useBreadcrumbContext()
  const { isLast } = useBreadcrumbItemContext()

  if (!separator || isLast) return null

  return (
    <span role="presentation" {...props}>
      {separator}
    </span>
  )
}

type BreadcrumbLinkProps<T extends React.ElementType = "a"> = React.ComponentPropsWithoutRef<T> & {
  as?: T
  href?: string
}
function BreadcrumbLink<T extends React.ElementType = "a">(props: BreadcrumbLinkProps<T>): JSX.Element {
  const { as: Component = "a", ...restProps } = props
  const { isCurrent } = useBreadcrumbItemContext()

  return (
    <Component {...restProps} aria-current={isCurrent ? "page" : undefined} href={isCurrent ? "" : restProps.href} />
  )
}

type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li"> & { isCurrentPage?: boolean }
function BreadcrumbItem(props: BreadcrumbItemProps): JSX.Element {
  const { isCurrentPage, style, children, ...restProps } = props

  return (
    <li style={{ ...styles.item, ...style }} {...restProps}>
      {children}
      <BreadcrumbSeparator />
    </li>
  )
}

type BreadcrumbProps = React.ComponentPropsWithoutRef<"ol"> & { separator: React.ReactNode }
function Breadcrumb(props: BreadcrumbProps): JSX.Element {
  const { separator, children, ...restProps } = props
  const count = React.Children.count(children)

  return (
    <BreadcrumbContext.Provider value={{ separator }}>
      <nav aria-label="Breadcrumb" {...restProps}>
        <ol style={styles.list}>
          {React.Children.map(children, (child, index) => {
            const isCurrent = React.isValidElement(child) && (child.props.isCurrentPage ?? false)
            const isLast = count === index + 1

            return (
              <BreadcrumbItemContext.Provider value={{ isCurrent, isLast }} key={index}>
                {child}
              </BreadcrumbItemContext.Provider>
            )
          })}
        </ol>
      </nav>
    </BreadcrumbContext.Provider>
  )
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator }
export type { BreadcrumbProps, BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbSeparatorProps }
