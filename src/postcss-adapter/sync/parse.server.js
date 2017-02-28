/**
 * @see https://gist.github.com/muratgozel/e3ca2c08f74c9cb6eb7314e3088edb77#gistcomment-1802108
 *
 * At the moment PostCSS async parser is using.
 *
 * To get it as sync function deasync package has been used.
 * Be careful! It blocks event loop. See more details in deasync README.
 *
 * @todo Find a way to do not use deasync
 */
import postcss from 'postcss'
import safeParse from 'postcss-safe-parser'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'
import deasync from 'deasync'
import guid from '../utils/guid'

const postcssrcSync = deasync(cb => {
  postcssrc()
    .then(res => cb(null, res))
    .catch(err => cb(err))
})

let config = {}
try {
  config = postcssrcSync()
} catch (err) {
  console.error(err)
}

const processor = postcss(config.plugins || [])
const options = config.options || {}
const finalOptions = { parser: safeParse, ...options }

const processSync = deasync((raw, cb) => {
  return processor.process(raw, finalOptions)
    .then(res => cb(null, res))
    .catch(err => cb(err))
})

/**
 * Parse specified Tagged Template Strings with CSS and expressions
 *
 * @param {String[]} chunks
 * @returns {Object} JSS object
 */
export default ({ rawStyles, ...args }) => {
  const objectCss = postcssJs.objectify(processSync(rawStyles).root)
  return {
    objectCss,
    ...args,
  }
}



