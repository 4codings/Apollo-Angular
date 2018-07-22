const omitTypenameKey = (key, value) => (key === '__typename' ? undefined : value)

export default function omitTypename(payload) {
  return JSON.parse(JSON.stringify(payload), omitTypenameKey)
}

