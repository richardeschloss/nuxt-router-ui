
import { register } from './plugin.register.js'

try {
  register.components(require.context('./VueD3', true, /\.(vue|js)$/))
  register.plugins()
  /* c8 ignore next */
} catch (err) {
  /* c8 ignore next */
}