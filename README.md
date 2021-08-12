# KeCaSn

Change strings from `snake_case` to `camelCase` or `kebab-case` and vice versa. 
Supports nested arrays and objects.

This library is built to automatically "upgrade" legacy APIs so you can use convenient and consistent
camelCase on the FE and keep using snake_case on the BE (API inputs & outputs).

## Realistic Example

```ts
import {pipe, fromSepCase, fromCamelCase, toSnakeCase, toCamelCase, convertData} from "kecasn"

// string -> string
const snakifyStr = pipe(fromCamelCase, toSnakeCase)     // Until JS natively supports `|>` pipeline operator
const camelizeStr = pipe(fromSepCase("_"), toCamelCase) // ...

// unknown -> unknown
const camelizeKeys = convertData(camelizeStr, {keys: true})   // values are not converted 
const snakifyKeys = convertData(snakifyStr, {keys: true})     // values are not converted 
const snakifyValues = convertData(snakifyStr, {values: true}) // keys are not converted

export const fetchPosts = async (query : FetchPostsQuery) : Promise<FetchPostsResult> => {
  const result = await fetchAPI(["SEARCH", "/api/posts"], {
    body: {                                 // FE                         -> BE 
      fields: snakifyValues((query.fields), // ["postTitle"]              -> ["post_title"]
      where: snakifyKeys(query.where),      // {postTags: ["TypeScript"]} -> {post_tags: ["TypeScript"]}
      order: snakifyValues(query.order),    // ["postTitle:asc"]          -> ["post_title:asc"]
      page: query.page || 1, 
      limit: query.limit || 10
    },
  })

  return {
    ...result,                         // BE                           -> FE 
    models: camelizeKeys(result.data), // [{post_title: "Some Title"}] -> [{postTitle: "Some Title"}]
  }
}
```

Note that `camelizeData` and `snakifyData` are unable to guess the output type: renaming object props
is a type change in general. It's not a problem whenever `unknown` is isolated within a strictly typed
function (like the above `fetchPosts`).

Let's iterate over the above example one more time. The following call: 

```ts
const posts = await fetchPosts({
  fields: ["id", "postTitle"], 
  where: {postTags: ["TypeScript"]}, 
  order: ["postTitle:asc"],
  limit: 2
})
```

will cause the following HTTP exchange: 

```
-> SEARCH /api/posts
{
  "fields": ["id", post_title"],        // values are snakified!
  "where": {post_tags: ["TypeScript"]}, // keys are snakified, values are unchanged!
  "order": ["post_title:asc"],          // values are snakified!
  "limit": 2  
}

<- 200 OK
{
  "models": [
    {"id": 1, "post_title": "First Post"}, 
    {"id": 2, "post_title": "Second Post"}
  ]
  "total": 24
}
```

and the following value of `posts` variable:

```ts
[
  {id: 1, postTitle: "First Post"}, // keys are camelized, values are unchanged!
  {id: 2, postTitle: "Second Post"} // keys are camelized, values are unchanged!
]
```

## API

### `pipe : <X, Y, Z>(fn1 : (x : X) => Y, fn2 : (y : Y) => Z) => (x : X) : Z`

Just a helper function to compose fn1 and fn2. `pipe(fn1, fn2)` is the same as `fn2(fn1)`.
This to avoid extra declarations and typings in the absence of [native JS operator(s)](https://github.com/tc39/proposal-pipeline-operator).

### `toCamelCase : (str : string) => string`

```ts
toCamelCase("foo bar") // "fooBar"
```

### `toSnakeCase : (str : string) => string`

```ts
toSnakeCase("foo bar") // "foo_bar"
```

### `toKebabCase : (str : string) => string`

```ts
toSnakeCase("foo bar") // "foo-bar"
```

### `fromCamelCase : (str : string) => string`

```ts
fromCamelCase("fooBar") // "foo bar"
```

### `fromSepCase : (sep : string) => (str : string) => string`

```ts
fromSepCase("_")("foo_bar:baz") // "foo bar:baz"
```

## `convertData : (convertStr : ConvertStr, options : {keys = false, values = false} = {}) => (x : unknown) => unknown`

const snakifyStr = pipe(fromCamelCase, toSnakeCase)     // Until JS natively supports `|>` pipeline operator
const camelizeStr = pipe(fromSepCase("_"), toCamelCase) // ...

```ts
const uppercase = (x : string) : string => x.toUpperCase()

convertData(uppercase, {values: true})("fooBar")              // "FOOBAR"
convertData(uppercase, {values: true})(["fooBar"])            // ["FOOBAR"]
convertData(uppercase, {values: true})({my_tags: ["fooBar"]}) // {my_tags: ["FOOBAR"]}
convertData(uppercase, {keys: true})({my_tags: ["fooBar"]})   // {MYTAGS: ["fooBar"]}
```

More realistic example was given above.

## Design Notes

Case casting functions that transform string expect the initial data to consist of words.
This is to have one common format (space separated string) and avoid proliferation of convertors
if more string cases are going to be supported. Compare the following:

```
fromX, toX, fromY, toY, fromZ, toZ => 2 * N => 2 * 3 == 6
vs
fromXtoY, fromXtoZ, fromYtoX, fromYtoZ, fromZtoX, fromZtoY => N ^ 2 - N => 3^2 - 3 == 6
```

Four supported cases would give: `2 * 4 vs 4^2 - 4 == 8 vs 12` and so on where `N ^ 2` 
clearly "dominates" over `2 * N`.

## Related Projects

- [Change-Case](https://github.com/blakeembrey/change-case): string-only, more supported cases, more settings.
