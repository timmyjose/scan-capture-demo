module.exports = function(api) {
  api.cache(true)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-worklets-core/plugin', '@babel/plugin-transform-template-literals']
    ]
  }
}
