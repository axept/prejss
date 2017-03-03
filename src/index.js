import createAdapter from './create-adapter'
import createAdapterAsync from './create-async-adapter'
import parser, { asyncParser } from 'prejss-postcss-parser'

export const preJSS = createAdapter({ parse: parser })
export const preJSSAsync = createAdapterAsync({ parse: asyncParser })

export default preJSS
