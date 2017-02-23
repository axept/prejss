/**
 * Originally based on:
 *   https://github.com/lttb/babel-plugin-prejss/blob/master/src/init-processor.js
 * 
 * @date 2017-02-23
 */

import postcss from 'postcss'
import postcssJs from 'postcss-js'
import postcssrc from 'postcss-load-config'


export default getProcessor => postcssrc()
  .then(({ plugins, options }) => {
    const css = postcss(plugins)

    getProcessor(null, ({ from, data }) => cb =>
      css.process(data, { ...options, from })
        .then(res => cb(null, postcssJs.objectify(res.root))))
  })
