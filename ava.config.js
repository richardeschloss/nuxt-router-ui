export default {
  ignoredByWatcher: [
    '!**/*.{js,vue}',
    'lib/components.js'
  ],
  files: [
    'test/module.js',
    'test/plugin.js',
    'test/D3Tree.js',
    'test/D3Modal.js',
    'test/D3RouterUI.js'
  ],
  nodeArguments: [
    '--no-warnings',
    '--experimental-loader=./test/utils/loaders.oldStable.js'
  ],
  serial: true,
  tap: false,
  verbose: true,
  color: true
}
