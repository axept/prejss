import guid from '../utils/guid'

export default function (chunks, ...variables) {
  let rawStyles
  let expressions = {}

  // Do we have expressions?
  if (chunks.length === 1) {
    rawStyles = chunks[0];
  } else {
    rawStyles = chunks.map((chunk, index) => {
      const variable = variables[index]
      if (typeof variable === 'function') {
        const key = `$^var__${guid()}`
        expressions[key] = variable
        return chunk + key
      } else if (typeof variable === 'string') {
        return chunk + variable
      } else {
        return chunk
      }
    }, '').join('')
  }

  return { rawStyles, expressions }
}