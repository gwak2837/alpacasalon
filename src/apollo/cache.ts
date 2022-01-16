import { InMemoryCache } from '@apollo/client'
import { TypedTypePolicies } from 'src/graphql/generated/types-and-hooks'

function infiniteScroll(existing: unknown[], incoming: unknown[]) {
  if (!existing) {
    return incoming
  } else {
    return [...existing, ...incoming]
  }
}

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      posts: {
        merge: infiniteScroll,
        keyArgs: [],
      },
      zoomReviews: {
        merge: infiniteScroll,
        keyArgs: [],
      },
    },
  },
  Post: {
    fields: {
      contents: {
        merge: (existing, incoming) => {
          return existing?.length > incoming?.length ? existing : incoming
        },
      },
    },
  },
}

const cache = new InMemoryCache({
  typePolicies,
})

export default cache
