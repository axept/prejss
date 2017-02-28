import { plainSource } from './create-adapter'

function isPromise(obj) {
  return (
    typeof obj === 'function' && typeof obj.then === 'function'
  )
}

export default function ({ prepare, parse, finalize }) {
  return async function (...source) {
    const prepareResult = (typeof prepare === 'function') ? prepare(...source) : plainSource(...source)
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

    const finalizeResult = (typeof finalize === 'function') ? finalize(parsed) : parsed
    let finalized
    if (isPromise(finalizeResult)) {
      finalized = await finalizeResult()
    } else {
      finalized = finalizeResult
    }

    return finalized
  }
}
