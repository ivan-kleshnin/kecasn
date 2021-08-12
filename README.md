# KeCaSn

Change strings from `snake_case` to `camelCase` or `kebab-case` and vice versa. 
Supports nested arrays and objects.

This library is built to automatically "upgrade" legacy APIs so you can use convenient and consistent
camelCase on the FE and keep using snake_case on the BE (API inputs & outputs).

## Example

```ts
import {pipe, toSnakeCase, toCamelCase, convertStr, convertData} from "kecasn"

// string -> string
const camelizeStr = pipe(fromSepCase("_"), toCamelCase) // Until JS natively supports `|>` pipeline operator
const snakifyStr = pipe(fromCamelCase, toSnakeCase)     // ...

// unknown -> unknown
const camelizeData = convertData(camelizeStr)
const snakifyData = convertData(snakifyStr)

export const fetchPosts = async (query : FetchPostsQuery) : Promise<FetchPostsResult> => {
  const result = await fetchAPI(["SEARCH", "/api/posts"], {
    body: {                               // FE                      -> BE 
      fields: snakifyData((query.fields), // ["postTitle"]           -> ["post_title"]
      where: snakifyData(query.where),    // {postTitle: {ne: null}} -> {post_title: {ne: null}}
      order: snakifyData(query.order),    // ["postTitle:asc"]       -> ["post_title:asc"]
      page: query.page || 1,
      limit: query.limit || 10,
    },
  })

  return {
    ...result,                         // BE                           -> FE 
    models: camelizeData(result.data), // [{post_title: "Some Title"}] -> [{postTitle: "Some Title"}]
  }
}
```

Note that `camelizeData` and `snakifyData` are unable to guess the output type: renaming object props
is a type change in general. It's not a problem whenever `unknown` is isolated within a strictly typed
function (like the above `fetchPosts`).

## Related Projects

- [Change-Case](https://github.com/blakeembrey/change-case): string-only, more supported cases, more settings.
