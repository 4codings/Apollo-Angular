const omitTypenameKey = (key, value) => (key === '__typename' ? undefined : value)

/**
 * Hack to remove __typename from object while preserving type
 * https://github.com/apollographql/apollo-client/issues/1913#issuecomment-393721604
 */
export default function omitTypename<T>(payload: T): T {
  return JSON.parse(JSON.stringify(payload), omitTypenameKey)
}

