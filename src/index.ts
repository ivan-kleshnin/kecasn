// HELPERS =========================================================================================
type OpaqueDict = Record<string, unknown>

let isPlainObject = (obj : unknown) : obj is OpaqueDict => {
  return toString.call(obj) == "[object Object]"
}

let isArray = (arr : unknown) : arr is readonly unknown[] => {
  return Array.isArray(arr)
}

let isString = (str : unknown) : str is string => {
  return typeof str == "string"
}

// CORE ============================================================================================
export const pipe = <X, Y, Z>(fn1 : (x : X) => Y, fn2 : (y : Y) => Z) => (x : X) : Z => {
  return fn2(fn1(x))
}

export const toCamelCase = (str : string) : string => {
  const [w, ...ws] = str.toLowerCase().split(" ")
  return [w, ...ws.map(w => w[0].toUpperCase() + w.slice(1))]
    .join("")
}

export const toSnakeCase = (str : string) : string => {
  const ws = str.toLowerCase().split(" ")
  return ws
    .join("_")
}

export const toKebabCase = (str : string) : string => {
  const ws = str.toLowerCase().split(" ")
  return ws
    .join("-")
}

export const fromCamelCase = (str : string) : string => {
  return str.split(/(?=[A-Z][a-z])/)
    .map(x => x.toLowerCase())
    .join(" ")
}

export const fromSepCase = (sep : string) => (str : string) : string => {
  return str.split(sep)
    .map(x => x.toLowerCase())
    .join(" ")
}

export const fromSnakeCase = fromSepCase("_")
export const fromKebabCase = fromSepCase("-")

// EXTRA ===========================================================================================

type ConvertStr = (str : string) => string

export const convertData = (convertStr : ConvertStr, {keys = false, values = false} = {}) => (x : unknown) : unknown => {
  if (isString(x)) {
    return values ? convertStr(x) : x
  } else if (isArray(x)) {
    const xs = x
    return xs.map(x => convertData(convertStr, {keys, values})(x))
  } else if (isPlainObject(x)) {
    const xs = x
    return Object.keys(xs).reduce((z, k) => ({...z,
      [keys ? convertStr(k) : k]: convertData(convertStr, {keys, values})(xs[k])
    }), {})
  } else {
    return x
  }
}
