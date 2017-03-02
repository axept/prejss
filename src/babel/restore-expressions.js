import * as t from 'babel-types'

const restoreExpressions = (objectCSS, expressions) => {
  return t.objectExpression(Object.entries(objectCSS).map(([ key, value ]) => {
    const finalKey = expressions[key] ? expressions[key] : t.stringLiteral(key);
    let finalValue;
    if (typeof value === 'object') {
      finalValue = restoreExpressions(value, expressions)
    } else if (expressions[value]) {
      finalValue = expressions[value]
    } else {
      finalValue = t.stringLiteral(value)
    }
    return t.objectProperty(finalKey, finalValue, !t.isStringLiteral(finalKey))
  }))
}


export default (objectCss, variables) => {
  return restoreExpressions(objectCss, variables)
}