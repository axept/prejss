const restoreExpressions = (objectCSS, expressions) => {
  return Object.keys(objectCSS).reduce((result, key) => {
    const value = objectCSS[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      result[key] = restoreExpressions(value, expressions)
    } else if (expressions[value]) {
      result[key] = expressions[value]
    } else {
      result[key] = value
    }
    return result
  }, {})
}

export default (objectCSS, expressions) => {

  // Go walk through objectCSS with recursion

  return restoreExpressions(objectCSS, expressions)
}