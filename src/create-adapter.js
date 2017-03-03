import extractExpressions from './extract-expressions'
import restoreExpressions from './restore-expressions'

export default ({ prepare, parse, finalize, ...options }) => {
  const extractFunc = options.extractExpressions || extractExpressions
  const restoreFunc = options.restoreExpressions || restoreExpressions
    
  return function (chunks, ...variables) {
    const { rawStyles, expressions } = extractFunc(chunks, ...variables)
    
    const prepared = (typeof prepare === 'function') ? prepare(rawStyles) : rawStyles
    const parsed = parse(prepared) // throw error if parse() is not defined properly
    
    const finalParsed = restoreFunc(parsed, expressions)

    return (typeof finalize === 'function') ? finalize(finalParsed) : finalParsed
  }
}
