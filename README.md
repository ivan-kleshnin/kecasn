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
  {"id": 1, "postTitle": "First Post"}, // keys are camelized, values are unchanged!
  {"id": 2, "postTitle": "Second Post"} // keys are camelized, values are unchanged!
]
```

## Related Projects

- [Change-Case](https://github.com/blakeembrey/change-case): string-only, more supported cases, more settings.
