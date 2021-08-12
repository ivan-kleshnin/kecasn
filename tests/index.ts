// import {pipe, fromCamelCase, fromSepCase, toCamelCase, toSnakeCase, convertData} from "../src/index.js"
//
// // const camelizeData = convertData(convertStr(toCamelCase))
//
// const camelizeStr = pipe(fromSepCase("_"), toCamelCase)
// const snakifyStr = pipe(fromSepCase("_"), toCamelCase)
//
// const snakifyData = convertData(snakifyStr)
// const camelizeData = convertData(camelizeStr)
//
// console.log(snakifyData(["postScore:asc"]))
// console.log(camelizeData(["post_score:asc"]))
//
// // // import {toCamelCase, /*toSnakeCase, camelToSnake, snakeToCamel*/} from "../src/index.js"
// // import {/*camelToSnakeObjDeep,*/ snakeToCamel, convertData, /*toSnakeCase, camelToSnake, snakeToCamel*/} from "../src/index.js"
// //
// // console.log(JSON.stringify(convertData(snakeToCamel)({
// //   foo_bar: [
// //     {baz_spam: ["123"]},
// //     {baz_spam: [new Date()]},
// //   ]
// // }), null, 2))
// //
// // // console.log("@ snakeToCamelArrDeep")
// // // console.log(JSON.stringify(snakeToCamelArrDeep([
// // //   {first_tag: [1, 2, 3]}
// // // ]), null ,2))
// //
// // // console.log("@ snakeToCamelObjRecursive")
// // // console.log(JSON.stringify(snakeToCamelObjDeep({
// // //   foo_bar: {
// // //     spam_one: new Date(),
// // //     spam_two3: {
// // //       something_long: [1, 2, 3],
// // //     },
// // //   },
// // //   foo_baz: [
// // //     {foo: [1, 2, 3], bar: new Date(), baz: {first_tag: [1, 2, 3]}}
// // //   ]
// // // }), null ,2))
// //
// // // console.log(JSON.stringify(camelToSnakeObjDeep({
// // //   fooBar: {
// // //     spamOne: new Date(),
// // //     spamTwo3: {
// // //       somethingLong: [1, 2, 3]
// // //     }
// // //   },
// // //   fooBaz: [
// // //     {foo: [1, 2, 3], bar: new Date(), baz: {firstTag: [1, 2, 3]}}
// // //   ]
// // // }), null ,2))
// //
// // // console.log("@ toCamelCase")
// // // console.log(toCamelCase("test string")) // testString
// // // console.log(toCamelCase("TEST STRING")) // ...
// // //
// // // console.log("@ toSnakeCase")
// // // console.log(toSnakeCase("test string")) // test_string
// // // console.log(toSnakeCase("TEST STRING")) // ...
// //
// // // console.log(toSnakeCase)
// // // console.log(camelToSnake)
// // // console.log("@ camelToSnake")
// // // console.log(camelToSnake("fooBar"))    // foo_bar
// // // console.log(camelToSnake("fooBar123")) // ...
// //
// // // console.log(snakeToCamel("TEST STRING")) // ...
// // // console.log(snakeToCamel("TEST STRING")) // ...
// //
// //
// // // console.log(camelToSnake("fooBar123Baz123"))
// // // console.log(snakeToCamel("foo_bar_123_baz123"))
// //
// // // console.log(CC.noCase("test_HTTP"))
// // // console.log(toNoCase("test_HTTP"))
// // // console.log("---")
// // // console.log(CC.noCase("test_123"))
// // // console.log(toNoCase("test_123"))
// // // console.log("---")
// // // console.log(CC.noCase("testOne"))
// // // console.log(toNoCase("testOne"))
// // // console.log("---")
// // // console.log(CC.noCase("test123"))
// // // console.log(toNoCase("test123"))
// // // console.log("---")
// // // console.log(CC.noCase("foo_two_Three"))
// // // console.log(toNoCase("foo_two_Three"))
// // // console.log("---")
// // // console.log(CC.noCase("123Foo"))
// // // console.log(toNoCase("123Foo"))
// // // console.log("---")
// // // console.log(CC.noCase("123_bar1"))
// // // console.log(toNoCase("123_bar1"))
// // // console.log("---")
// // // console.log(CC.noCase("123#bar=1"))
// // // console.log(toNoCase("123#bar=1"))
