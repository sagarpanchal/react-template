export type KeyValue = { key: string; value: unknown }

export type Comparator = (a: KeyValue, b: KeyValue) => number

export type Replacer = (this: unknown, key: string | number, value: unknown) => any

export interface Options {
  cmp?: Comparator
  space?: string | number
  replacer?: Replacer
  cycles?: boolean
}

const defaultOptions = {
  cmp: undefined,
  space: "",
  replacer: ((_, value) => value) satisfies Replacer,
  cycles: false,
}

export const stringify = (obj: any, _opts?: Comparator | Options) => {
  const opts = {
    cmp: typeof _opts === "function" ? _opts : _opts?.cmp,
    space: (() => {
      if (typeof _opts !== "object") return defaultOptions.space
      if (typeof _opts.space === "string") return _opts.space
      if (typeof _opts.space === "number") return " ".repeat(_opts.space)
      return ""
    })(),
    replacer: (typeof _opts === "object" && _opts.replacer) || defaultOptions.replacer,
    cycles: (typeof _opts === "object" && _opts.cycles) || false,
  }

  const cmp =
    opts.cmp &&
    ((node: any) => (a: string, b: string) => opts.cmp!({ key: a, value: node[a] }, { key: b, value: node[b] }))

  const seen: any[] = []

  const _stringify = (parent: any, key: string | number, node: any, level: number): string => {
    const indent = opts.space ? `\n${opts.space.repeat(level)}` : ""
    const colonSeparator = opts.space ? ": " : ":"

    if (node && node.toJSON && typeof node.toJSON === "function") node = node.toJSON()

    node = opts.replacer.bind(parent)(key, node)

    if (node === undefined) return ""

    if (typeof node !== "object" || node === null) return JSON.stringify(node)

    if (Array.isArray(node)) {
      const out = []

      for (let i = 0; i < node.length; i++) {
        const item = _stringify(node, i, node[i], level + 1) || JSON.stringify(null)
        out.push(indent + opts.space + item)
      }

      return "[" + out.join(",") + indent + "]"
    }

    if (seen.indexOf(node) !== -1) {
      if (opts.cycles) {
        return JSON.stringify("__cycle__")
      }
      throw new TypeError("Converting circular structure to JSON")
    } else {
      seen.push(node)
    }

    const keys = Object.keys(node).sort(cmp && cmp(node))
    const out: string[] = []
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = _stringify(node, key, node[key], level + 1)
      if (!value) continue

      const keyValue = JSON.stringify(key) + colonSeparator + value
      out.push(indent + opts.space + keyValue)
    }
    seen.splice(seen.indexOf(node), 1)
    return "{" + out.join(",") + indent + "}"
  }

  return _stringify({ "": obj }, "", obj, 0)
}
