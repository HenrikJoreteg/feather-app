require('babel-register')
var webpack = require('webpack')
var getConfig = require('hjs-webpack')
var toHtml = require('vdom-to-html')
var app = require('./src/views/app').default

var config = getConfig({
  in: 'src/main.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    function render (state) {
      return context.defaultTemplate({html: toHtml(app(state))})
    }

    return {
      'about.html': render({url: '/about', count: 0}),
      'index.html': render({url: '/', count: 0})
    }
  }
})

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^ud$/, __dirname + '/src/ud.production.js')
  )
}

module.exports = config
