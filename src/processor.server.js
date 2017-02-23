/**
 * @see https://gist.github.com/muratgozel/e3ca2c08f74c9cb6eb7314e3088edb77#gistcomment-1802108
 */

import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'
import deasync from 'deasync'

const postcssrcSync = deasync(cb => {
  postcssrc()
    .then(result => cb(null, result))
    .catch(err => cb(err))
})
const config = postcssrcSync()
const postcss = postcssJs.sync(config.plugins)

export default (rawStyles) => postcssJs.objectify(postcss.parse(rawStyles))
  
