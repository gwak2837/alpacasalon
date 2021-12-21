import { ApolloClient, NormalizedCacheObject, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import cache from './cache'

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
})

// Pull the login token from browser Storage every time a request is sent:
const authLink = setContext((_, { headers }) => {
  const jwt =
    globalThis.sessionStorage?.getItem('jwt') ?? globalThis.localStorage?.getItem('jwt') ?? ''

  return {
    headers: {
      ...headers,
      authorization: jwt,
    },
  }
})

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
})
