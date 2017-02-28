/**
 * @see https://gist.github.com/muratgozel/e3ca2c08f74c9cb6eb7314e3088edb77#gistcomment-1802108
 */
import postcss from 'postcss'
import safeParse from 'postcss-safe-parser'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'
import guid from '../utils/guid'

let config
let options
let processor

/**
 * 1. Initiate config, options and processor variables in module scope, if they are not initiated yet
 * 2. Process parsing with initiated options
 * 
 * @param {String} rawStyles
 * @returns {Object} JSS Object
 */
async function processParsing(rawStyles) {
  if (!config) {
    config = await postcssrc()

    const loadedConfig = config.options || {}
    options = { parser: safeParse, ...loadedConfig }
  }
  
  if (!processor) {
    processor = postcss(config.plugins || [])
  }

  return processor.process(raw, options)
} 

/**
 * Parse specified Tagged Template Strings with CSS and expressions
 *
 * @param {String[]} chunks
 * @returns {Object} JSS object
 */
export default async (chunks, ...variables) => {
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

  const processed = await processParsing(rawStyles)
  const objectCss = postcssJs.objectify(processed.root)

  // Restore functions in style attributes
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



