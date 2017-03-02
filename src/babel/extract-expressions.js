import guid from '../utils/guid'

export default ({ quasis, expressions }) => {
  const chunks = quasis.map(quasi => quasi.value.cooked)
  let variables = {}

  const rawStyle = chunks.reduce((result, chunk, index) => {
    const variable = expressions[index]
    if (variable) {
      const key = `$^var__${guid()}`
      variables[key] = variable
      return result + chunk + key
    } else {
      return result + chunk
    }
  }, '')

  return { rawStyle, variables }
}