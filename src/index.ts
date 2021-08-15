// HELPERS =========================================================================================
type OpaqueDict = Record<string, unknown>

const isPlainObject = (obj : unknown) : obj is OpaqueDict => {
  return toString.call(obj) == "[object Object]"
}

const isArray = (arr : unknown) : arr is readonly unknown[] => {
  return Array.isArray(arr)
}

const isString = (str : unknown) : str is string => {
  return typeof str == "string"
}

// CORE ============================================================================================
export const pipe = <X, Y, Z>(fn1 : (x : X) => Y, fn2 : (y : Y) => Z) => (x : X) : Z => {
  return fn2(fn1(x))
}

export const toCamelCase = (s : string) : string => {
  const [w, ...ws] = s.toLowerCase().split(" ")
  return [w, ...ws.map(w => w[0].toUpperCase() + w.slice(1))].join("")
}

export const toSepCase = (sep : string) => (s : string) : string => {
  return s.toLowerCase().split(" ").join(sep)
}

export const toSnakeCase = toSepCase("_")
export const toKebabCase = toSepCase("-")

export const fromCamelCase = (s : string) : string => {
  // no support for fooBAR and foo6bar splitting until https://caniuse.com/js-regexp-lookbehind
  return s.split(/(?=[A-Z][a-z])/).map(x => x.toLowerCase()).join(" ")
}

export const fromSepCase = (sep : string) => (s : string) : string => {
  return s.split(sep).map(x => x.toLowerCase()).join(" ")
}

export const fromSnakeCase = fromSepCase("_")
export const fromKebabCase = fromSepCase("-")

// EXTRA ===========================================================================================

type ConvertStr = (s : string) => string

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
