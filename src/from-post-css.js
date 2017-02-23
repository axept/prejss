/**
 * Until we did not solved how we can get all PostCSS plugins in browser,
 * we have to throw error and require to use babel-plugin-prejss.
 *
 * @todo Try to do a workaround about it https://github.com/postcss/postcss#browser
 *
 * Any suggestions? Feel free to share it:
 * - https://github.com/axept/jss-from-postcss/issues/new
 */

if (typeof browser !== 'undefined') {

  throw new Error(
    'jss-from-postcss fatal error: Sorry, browser is not supporting out of the box. Please use babel-plugin-prejss instead.'
  )

} else {

  // TODO Check for React Native too?
  exports.default = require('./processor.server')

}
