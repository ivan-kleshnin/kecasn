# KeCaSn

**WIP** Change strings from `snake_case` to `camelCase` or `kebab-case` and vice versa. 
Supports nested arrays and objects.

This library was created to automatically "upgrade" legacy APIs so you can use convenient and consistent
camelCase on the FE and keep using snake_case on the BE (API inputs & outputs).

## Realistic Example

Many older APIs consume and return data in snake_case format and a rewrite may cost $$$.
Tolerating the problem is not an option as from the fetching layer snake_case will quickly 
reach form field names, validators, etc and you'll have to constantly think which case to use where.

An alternative (and proposed) approach is to lock snake_case and all the necessary conversion in a single
place: in the API handling layer.  Unless your req/resp data is huge (so it's processing becomes expensive) 
this approach will result in more consistent and readable code. 

**lib/api/fetchers.ts**

```ts
import {pipe, fromSnakeCase, fromCamelCase, toSnakeCase, toCamelCase, convertData} from "kecasn"

// string -> string
const snakifyStr = pipe(fromCamelCase, toSnakeCase)  // Until JS natively supports `|>` pipeline operator
const camelizeStr = pipe(fromSnakeCase, toCamelCase) // ...

// unknown -> unknown
const snakifyKeys = convertData(snakifyStr, {keys: true})     // values are not converted 
const snakifyValues = convertData(snakifyStr, {values: true}) // keys are not converted
const camelizeKeys = convertData(camelizeStr, {keys: true})   // values are not converted 

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

API consists of several low-level functions like `toCamelCase` or `fromSnakeCase` and one high-level function `convertData`.
Low-level case-casting functions work with (accept or return) **words** i.e. space separated strings. 
This common format is necesary to reduce the number of converting functions (explained below).

### Words to Case

Each `toXyz` function accepts words and produces a cased string.

#### `toCamelCase : (s : string) => string`

```ts
toCamelCase("foo bar") // "fooBar"  -- words are formatted (to camelCase)
toCamelCase("foo:bar") // "foo:bar" -- /
```

#### `toSnakeCase : (s : string) => string`

```ts
toSnakeCase("foo bar") // "foo_bar" -- words are formatted (to snake_case)
toSnakeCase("foo bar") // "foo:bar" -- /
```

#### `toKebabCase : (s : string) => string`

```ts
toKebabCase("foo bar") // "foo-bar" -- words are formatted (to kebab-case)
toKebabCase("foo:bar") // "foo:bar"  -- /
```

### Case to Words

Each `fromXyz` function expects a cased string and produces words.

#### `fromCamelCase : (s : string) => string`

```ts
fromCamelCase("fooBar")  // "foo bar" -- camelCase is parsed (to words)
fromCamelCase("foo_bar") // "foo:bar" -- /
```

#### `fromSnakeCase : (s : string) => string`

```ts
fromSnakeCase("foo_bar_baz") // "foo bar baz" -- snake_case is parsed (to words)
fromSnakeCase("foo:bar")     // "foo:bar"     -- /
```

#### `fromKebabCase : (s : string) => string`

```ts
fromKebabCase("some-css-rule") // "some css rule" -- kebab-case is parsed (to words)
fromKebabCase("some:css")      // "some:css"      -- /
```

### Other

#### `pipe : <X, Y, Z>(fn1 : (x : X) => Y, fn2 : (y : Y) => Z) => (x : X) : Z`

Just a tiny helper function to compose `fn1` and `fn2`. `pipe(fn1, fn2)` is the same as `fn2(fn1)`.
Useful to avoid extra declarations and typings in the absence of [native JS operator(s)](https://github.com/tc39/proposal-pipeline-operator).

#### `convertData : (convertStr : ConvertStr, options : Options = {}) => (x : unknown) => unknown`

Where `ConvertStr` and `Options` are:

```ts
type ConvertStr = (s : string) => string
type Options = {keys ?: false, values ?: false} // both default to `false`
```

Example:

```ts
const uppercase = (x : string) : string => x.toUpperCase()

convertData(uppercase, {values: true})("fooBar")              // "FOOBAR"
convertData(uppercase, {values: true})(["fooBar"])            // ["FOOBAR"]
convertData(uppercase, {values: true})({my_tags: ["fooBar"]}) // {my_tags: ["FOOBAR"]}
convertData(uppercase, {keys: true})({my_tags: ["fooBar"]})   // {MYTAGS: ["fooBar"]}
```

More realistic example was given above.

#### `fromSepCase`, `toSepCase`

Undocumented (but exported) functions used to build `fromSnakeCase`, `toKebabCase` etc.
Use them if you need a different separator.

## Design Notes

`fromCamel, toCamel, fromSnake, toSnake` is an objectively better design than `camelToSnake, snakeToCamel`

Compare the following possible design (which was chosen):

```
fromX, toX, fromY, toY, fromZ, toZ 
---
Number of functions Z1 equals:
2 * N where N is the № of supported cases

N=2 => 2 * 2 = 4
N=3 => 2 * 3 = 6 
N=4 => 2 * 4 = 8 
N=5 => 2 * 5 = 10 
```

and the following (which was rejected):

```
fromXtoY, fromXtoZ, fromYtoX, fromYtoZ, fromZtoX, fromZtoY 
---
Number of functions Z2 equals:
N ^ 2 - N where N is the № of supported cases

N = 2 => 2 ^ 2 - 2 = 2 (for N = 2 we get just 2 functions camelToSnake, snakeToCamel) 
N = 3 => 3 ^ 2 - 3 = 6 (equals Z1)
N = 4 => 4 ^ 2 - 4 = 12 (and it starts to...)
N = 5 => 5 ^ 2 - 5 = 20 (proliferate... Just 5 supported cases require twice as much functions!)
```

For now we support just `snake`, `kebab` and `camel` so both approaches are equivalent (in terms
of function №). But you got the point.

## Related Projects

- [Change-Case](https://github.com/blakeembrey/change-case): string-only, more supported cases, more settings.
