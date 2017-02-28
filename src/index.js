import createAdapter from './create-adapter'
import createAdapterAsync from './create-async-adapter'
import adapter, { asyncAdapter } from './postcss-adapter'

export const preJSS = createAdapter(adapter)
export const preJSSAsync = createAdapterAsync(asyncAdapter)

export default preJSS
