import extractExpressions from './extract-expressions'
import restoreExpressions from './restore-expressions'
import isPromise from './utils/is-promise'

export default ({ prepare, parse, finalize, ...options }) => {
  const extractFunc = options.extractExpressions || extractExpressions
  const restoreFunc = options.restoreExpressions || restoreExpressions    

  return async (chunks, ...variables) => {
    const { rawStyles, expressions } = extractFunc(chunks, ...variables)
    
    const prepareResult = (typeof prepare === 'function') ? prepare(rawStyles) : rawStyles
    let prepared
    if (isPromise(prepareResult)) {
      prepared = await prepareResult()
    } else {
      prepared = prepareResult
    }
    
    // throw error if parse() is not defined properly
    const parseResult = parse(prepared)
    let parsed
    if (isPromise(parseResult)) {
      parsed = await parseResult()
    } else {
      parsed = parseResult
    }

    const finalParsed = restoreExpressions(parsed, expressions)

    const finalizeResult = (typeof finalize === 'function') ? finalize(finalParsed) : finalParsed
    let finalized
    if (isPromise(finalizeResult)) {
      finalized = await finalizeResult()
    } else {
      finalized = finalizeResult
    }

    return finalized
  }
}
