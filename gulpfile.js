const { series, parallel } = require('gulp')
const clean = require('./gulp/clean')
const eleventy = require('./gulp/eleventy')
const sass = require('./gulp/sass')
const { jsDevelopment, jsProduction } = require('./gulp/rollup')
const images = require('./gulp/images')
const videos = require('./gulp/videos')
const watch = require('./gulp/watch')
const { browserSync } = require('./gulp/browser-sync')
const rev = require('./gulp/rev')
const { syncFiles, syncSecrets } = require('./gulp/sync')

exports.clean = clean
exports.eleventy = eleventy
exports.sass = sass
exports.jsdev = jsDevelopment
exports.jsprod = jsProduction
exports.images = images
exports.serve = browserSync
exports.rev = rev
exports.videos = videos

exports.default = series(
  clean,
  parallel(sass, eleventy, images, videos),
  parallel(jsDevelopment, browserSync, watch)
)

exports.build = series(
  clean,
  parallel(sass, images, jsProduction, videos),
  rev,
  eleventy
)

exports.deploy = parallel(syncSecrets, syncFiles)
exports.deployCI = series(syncFiles)
