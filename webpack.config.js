require('babel-register')
var getConfig = require('hjs-webpack')
var toHtml = require('vdom-to-html')
var ui = require('./src/ui').default

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    return {
      'one.html': context.defaultTemplate({html: toHtml(ui({url: '/one', count: 0}))}),
      'two.html': context.defaultTemplate({html: toHtml(ui({url: '/two', count: 0}))}),
      'index.html': context.defaultTemplate({html: toHtml(ui({url: '/', count: 0}))})
    }
  }
})
