const gulp = require('gulp')
const config = require('../config')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const size = require('gulp-size')

const isProd = config.env === 'prod'

gulp.task('minify-images', () => {
  return gulp.src('src/images/**/*')
    .pipe((newer('dev/images')))
    .pipe(imagemin(imageminOpts))
    .pipe(gulp.dest('dev/images'))
    .pipe(size({'title': 'images'}))
})

gulp.task('images', ['minify-images'], () => {
  if (isProd) {
    return gulp.src('dev/images/**/*')
      .pipe(gulp.dest('dist/images'))
  }
})

const imageminOpts = {
  interlaced: true,
  optimizationLevel: 5,
  progressive: true
}
