var getConfig = require('hjs-webpack')


module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    return context.defaultTemplate({html: '<div></div>'})
  }
})
