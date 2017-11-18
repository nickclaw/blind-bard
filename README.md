# blind-bard

Experiments with graphql, typescript, and librivox.

### Example Query

```graphql
{
  books(first: 10) {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        title
      }
    }
  }
}
```
