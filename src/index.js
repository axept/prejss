import createAdapter from './create-adapter'
import createAdapterAsync from './create-async-adapter'
import adapter, { asyncAdapter } from './postcss-adapter'

const preJSS = createAdapter(adapter)
const preJSSAsync = createAsyncAdapter(asyncAdapter)

export preJSS
export preJSSAsync

export default preJSS
