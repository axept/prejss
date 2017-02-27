export default function ({ prepare, parse, finalize }) {
  return function (rawStyles) {
    const prepared = (typeof prepare === 'function') ? prepare(rawStyles) : rawStyles
    const parsed = parse(prepared) // throw error if parse() is not defined properly
    return (typeof finalize === 'function') ? finalize(parsed) : parsed
  }
}
