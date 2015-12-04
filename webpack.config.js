require('babel-register')
var getConfig = require('hjs-webpack')
var toHtml = require('vdom-to-html')
var appView = require('./src/view').default

module.exports = getConfig({
  in: 'src/root.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    function render (state) {
      return context.defaultTemplate({html: toHtml(appView(state))})
    }

    return {
      'one.html': render({url: '/one', count: 0}),
      'two.html': render({url: '/two', count: 0}),
      'index.html': render({url: '/', count: 0})
    }
  }
})
