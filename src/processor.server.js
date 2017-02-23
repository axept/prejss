/**
 * @see https://gist.github.com/muratgozel/e3ca2c08f74c9cb6eb7314e3088edb77#gistcomment-1802108
 */

import postcss from 'postcss'
import safeParse from 'postcss-safe-parser'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'
import deasync from 'deasync'

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

// TODO Find a way to do not use deasync for regular calls
const processSync = deasync((raw, cb) => {
  processor.process(raw, { parser: safeParse, ...options })
    .then(res => cb(null, res))
    .catch(err => cb(err))
})

export default (templatedString) => {
  const rawStyles = templatedString.join('')
  return postcssJs.objectify(processSync(rawStyles).root)
}
