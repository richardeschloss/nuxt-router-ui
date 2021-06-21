import test from 'ava'

test('Plugin', async (t) => {
  global.require = {
    context(dir) {
      t.is(dir, './VueD3')
      function r(fname) {
        return { default: {}}
      }
      r.keys = () => [
        'D3RouterUI.js',
        'D3Tree.js'
      ]
      return r
    }
  }
  
  await import('../lib/plugin.js')
})