const gulp = require('gulp')
const runSequence = require('run-sequence')
const config = require('../config')

gulp.task('default', (cb) => {
  if (config.env === 'dev') {
    runSequence(
      ['clean'],
      ['images', 'sass'],
      ['generateSite'],
      ['browserSync', 'watch', 'js'],
      cb)
  } else if (config.env === 'prod') {
    runSequence(
      ['clean'],
      ['sass', 'js', 'images'],
      ['modify-rev'],
      ['generateSite'],
      'sitemap',
      cb
    )
  }
})
