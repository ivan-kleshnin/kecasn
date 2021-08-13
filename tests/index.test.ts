import {
  toCamelCase, toSnakeCase, toKebabCase,
  fromCamelCase, fromSnakeCase, fromKebabCase,
  convertData,
} from "../src"

describe("toCamelCase", () => {
  it("concats words to a cased string", () => {
    expect(toCamelCase("foo bar BAZ Spam")).toBe("fooBarBazSpam")
  })

  it("ignores non-space separators", () => {
    expect(toCamelCase("foo#bar.BAZ-Spam_Egg5foo")).toBe("foo#bar.baz-spam_egg5foo")
  })
})

describe("toSnakeCase", () => {
  it("concats words to a cased string", () => {
    expect(toSnakeCase("foo bar BAZ Spam")).toBe("foo_bar_baz_spam")
  })

  it("ignores non-space separators", () => {
    expect(toSnakeCase("foo#bar.BAZ-Spam_Egg5foo")).toBe("foo#bar.baz-spam_egg5foo")
  })
})

describe("toKebabCase", () => {
  it("concats words to a cased string", () => {
    expect(toKebabCase("foo bar BAZ Spam")).toBe("foo-bar-baz-spam")
  })

  it("ignores non-space separators", () => {
    expect(toKebabCase("foo#bar.BAZ-Spam_Egg5foo")).toBe("foo#bar.baz-spam_egg5foo")
  })
})

describe("fromCamelCase", () => {
  it("splits a cased string to words", () => {
    // TODO check a note about "BarBAZ" and "Foo6bar" cases in sources
    expect(fromCamelCase("fooBarBAZSpam5Foo6bar")).toBe("foo barbaz spam5 foo6bar")
  })

  it("ignores non-cased separators", () => {
    expect(fromCamelCase("foo#bar.baz-spam_egg")).toBe("foo#bar.baz-spam_egg")
  })
})

describe("fromSnakeCase", () => {
  it("splits a cased string to words", () => {
    expect(fromSnakeCase("foo_Bar_BAZ_sPAM_4test_test5")).toBe("foo bar baz spam 4test test5")
  })

  it("ignores non-cased separators", () => {
    expect(fromSnakeCase("foo#bar.baz-spamEgg")).toBe("foo#bar.baz-spamegg")
  })
})

describe("fromKebabCase", () => {
  it("splits a cased string to words", () => {
    expect(fromKebabCase("foo-Bar-BAZ-sPAM-4test-test5")).toBe("foo bar baz spam 4test test5")
  })

  it("ignores non-cased separators", () => {
    expect(fromKebabCase("foo#bar.baz_spamEgg")).toBe("foo#bar.baz_spamegg")
  })
})

describe("convertData", () => {
  it("does nothing by default", () => {
    const uppercase = (x : string) : string => x.toUpperCase()
    const convert = convertData(uppercase)

    expect(convert("fooBar")).toEqual("fooBar")
    expect(convert(["fooBar"])).toEqual(["fooBar"])
    expect(convert({myTags: ["fooBar"]})).toEqual({myTags: ["fooBar"]})
    expect(convert({nested: {myTags: ["fooBar"]}})).toEqual({nested: {myTags: ["fooBar"]}})
  })

  it("can convert values", () => {
    const uppercase = (x : string) : string => x.toUpperCase()
    const options = {values: true}
    const convert = convertData(uppercase, options)

    expect(convert("fooBar")).toEqual("FOOBAR")
    expect(convert(["fooBar"])).toEqual(["FOOBAR"])
    expect(convert({myTags: ["fooBar"]})).toEqual({myTags: ["FOOBAR"]})
    expect(convert({nested: {myTags: ["fooBar"]}})).toEqual({nested: {myTags: ["FOOBAR"]}})
  })

  it("can convert keys", () => {
    const uppercase = (x : string) : string => x.toUpperCase()
    const options = {keys: true}
    const convert = convertData(uppercase, options)

    expect(convert("fooBar")).toEqual("fooBar")
    expect(convert(["fooBar"])).toEqual(["fooBar"])
    expect(convert({myTags: ["fooBar"]})).toEqual({MYTAGS: ["fooBar"]})
    expect(convert({nested: {myTags: ["fooBar"]}})).toEqual({NESTED: {MYTAGS: ["fooBar"]}})
  })

  it("ignores exotic objects", () => {
    const uppercase = (x : string) : string => x.toUpperCase()
    const options = {values: true}
    const convert = convertData(uppercase, options)

    const date = new Date()
    expect(convert({date})).toEqual({date})

    const regex = new RegExp("whatever")
    expect(convert({regex})).toEqual({regex})
  })
})
