// HELPERS =========================================================================================
type OpaqueDict = Record<string, unknown>

export let isPlainObject = (obj : unknown) : obj is OpaqueDict => {
  return toString.call(obj) == "[object Object]"
}

export let isArray = (arr : unknown) : arr is readonly unknown[] => {
  return Array.isArray(arr)
}

export let isString = (str : unknown) : str is string => {
  return typeof str == "string"
}

// CORE ============================================================================================
export const pipe = <X, Y, Z>(fn1 : (x : X) => Y, fn2 : (y : Y) => Z) => (x : X) => {
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

// EXTRA-1 =========================================================================================

// convertStr
export type ConvertStr = (str : string) => string

// export const convertStr = (fnFrom : ConvertStr, fnTo : ConvertStr) => (str : string) : string => {
//   return fnTo(fnFrom(str))
// }

// export const camelToSnake = convertStr(toSnakeCase)
// export const camelToKebab = convertStr(toKebabCase)
// export const snakeToCamel = convertStr(toCamelCase)

// convertArr
// export type ConvertArr = (arr : readonly string[]) => readonly string[]
//
// export const camelToSnakeArr : ConvertArr = (arr) => {
//   return arr.map(camelToSnake)
// }
//
// export const snakeToCamelArr : ConvertArr = (arr) => {
//   return arr.map(snakeToCamel)
// }
//
// export const convertArr = (convertStr : ConvertStr) => (arr : readonly string[]): readonly string[] => {
//   return arr.map(convertStr)
// }

// convertObj
// export type ConvertObj = (obj : Record<string, string>) => Record<string, string>
//
// export const convertObj = (convertStr : ConvertStr) => (obj : Record<string, string>): Record<string, string> => {
//   return Object.keys(obj).reduce((z, k) => ({...z, [convertStr(k)]: obj[k]}), {})
// }
//
// export const camelToSnakeObj = convertObj(camelToSnake)
// export const camelToKebabObj = convertObj(camelToKebab)
// export const snakeToCamelObj = convertObj(snakeToCamel)

// EXTRA-2 =========================================================================================

export type ConvertDataOptions = {
  keys ?: boolean
  values ?: boolean
}

export const convertData = (convertStr : ConvertStr, options : ConvertDataOptions = {}) => (x : unknown) : unknown => {
  const {keys : withKeys = false, values : withValues = false} = options

  if (isString(x)) {
    return withValues ? convertStr(x) : x
  } else if (isArray(x)) {
    const xs = x
    return xs.map(x => convertData(convertStr, options)(x))
  } else if (isPlainObject(x)) {
    const xs = x
    return Object.keys(xs).reduce((z, k) => ({...z,
      [withKeys ? convertStr(k) : k]: convertData(convertStr, options)(xs[k])
    }), {})
  } else {
    return x
  }
}
