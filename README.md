# KeCaSn

Change strings from `snake_case` to `camelCase` or `kebab-case` and vice versa. 
Supports nested arrays and objects.

This library is built to automatically "upgrade" legacy APIs so you can use convenient and consistent
camelCase in your FE code and keep using snake_case in API handler input & output.

## Example

```ts
import {pipe, toSnakeCase, toCamelCase, convertStr, convertData} from "kecasn"

// string -> string
const camelizeStr = pipe(fromSepCase("_"), toCamelCase) // Until JS natively supports `|>` pipeline operator
const snakifyStr = pipe(fromCamelCase, toSnakeCase)     // ...

// any -> any
const camelizeData = convertData(camelizeStr)
const snakifyData = convertData(snakifyStr)

export const fetchPosts = async (query : FetchPostsQuery) : Promise<FetchPostsResult> => {
  const result = await fetchAPI(["SEARCH", "/api/posts"], {
    body: {
      fields: snakifyData((query.fields), // ["id", "postScore"]  -> ["id", "post_score"]
      where: snakifyData(query.where),    // {postScore: {gt: 0}} -> {post_score: {gt: 18}}
      order: snakifyData(query.order),    // ["postScore:asc"]    -> ["post_score:asc"]
      page: query.page || 1,
      limit: query.limit || 10,
    },
  })

  return {
    ...result,
    models: camelizeData(result.data),
  }
}
```

Note that `camelizeData` and `snakifyData` are unable to guess the output type: renaming object props
is a type change in general. It's not a problem whenever `unknown` is isolated within a strictly typed
function (like the above `fetchPosts`).

## Related Projects

- [Change-Case](https://github.com/blakeembrey/change-case): string-only, more supported cases, more settings.
