import config from '../config/config'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { DocumentNode } from 'graphql'
import fetch from 'cross-fetch'

const { subgraphUrl } = config

const httpLink = createHttpLink({
  uri: subgraphUrl,
  fetch: fetch
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    }
  }
})

/** TODO: figure out how to properly type this */
export const getQuery = async (query: DocumentNode): Promise<any> => {
  try {
    const res = await client.query({ query })
    return res.data
  } catch (e) {
    console.error(e)
  }
}
