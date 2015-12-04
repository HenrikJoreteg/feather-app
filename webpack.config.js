require('babel-register')
var getConfig = require('hjs-webpack')
var toHtml = require('vdom-to-html')
var app = require('./src/views/app').default

module.exports = getConfig({
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
