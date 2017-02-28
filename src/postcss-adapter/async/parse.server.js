/**
 * @see https://gist.github.com/muratgozel/e3ca2c08f74c9cb6eb7314e3088edb77#gistcomment-1802108
 */
import postcss from 'postcss'
import safeParse from 'postcss-safe-parser'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'

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

  return processor.process(rawStyles, options)
} 

/**
 * Parse specified Tagged Template Strings with CSS and expressions
 *
 * @param {String[]} chunks
 * @returns {Object} JSS object
 */
export default async ({ rawStyles, ...args }) => {
  const processed = await processParsing(rawStyles)
  const objectCss = postcssJs.objectify(processed.root)
  return {
    objectCss,
    ...args,
  }
}



