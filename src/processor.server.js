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
  return processor.process(raw, { parser: safeParse, ...options })
    .then(res => cb(null, res))
    .catch(err => cb(err))
})

export default (chunks, ...variables) => {
  let rawStyles
  if (chunks.length === 1) {
    rawStyles = chunks[0];
  } else {
    rawStyles = chunks.map((chunk, index) => {
      const variable = variables[index]
      if (typeof variable === 'string') {
        return chunk + variable
      } else {
        return chunk
      }
    }, '').join('')
  }
  return postcssJs.objectify(processSync(rawStyles).root)
}
