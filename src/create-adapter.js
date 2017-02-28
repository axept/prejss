export function plainSource(chunks, ...variables) {
  return chunks.map((chunk, index) => {
    const variable = variables[index]
    if (variable && typeof variable !== 'string') {
      throw new Error('prejss: tagged template has object or function as argument, please use custom preparer for support')
    } else if (variable) {
      return chunk + variable
    } else {
      return chunk
    }
  }).join('')
}

export default function ({ prepare, parse, finalize }) {
  return function (...source) {
    const prepared = (typeof prepare === 'function') ? prepare(...source) : plainSource(...source)
    const parsed = parse(prepared) // throw error if parse() is not defined properly
    return (typeof finalize === 'function') ? finalize(parsed) : parsed
  }
}
