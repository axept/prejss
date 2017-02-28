export default function ({ objectCss, expressions }) {
  function restoreExpressions(target) {
    return Object.keys(target).reduce((result, key) => {
      const value = target[key];
      if (Object.prototype.toString.call(value) === '[object Object]') {
        result[key] = restoreExpressions(value)
      } else if (expressions[value]){
        result[key] = expressions[value]
      } else {
        result[key] = value
      }
      return result
    }, {});

  }

  return restoreExpressions(objectCss)
}