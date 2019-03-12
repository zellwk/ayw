const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync')
const config = require('../config')
const cssnano = require('gulp-cssnano')
const gulpIf = require('gulp-if')
const plumber = require('../custom_modules/plumber')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint')
const size = require('gulp-size')
const sourcemaps = require('gulp-sourcemaps')

const isDev = config.env === 'dev'
const isProd = config.env === 'prod'

const src = config.src + '/scss/**/*.{scss,sass}'
const dest = config.dest + '/css'
const sassOpts = { includePaths: ['./node_modules', './bower_components'] }
const autoprefixerOpts = { browsers: ['last 2 versions'] }

gulp.task('sass', () => {
  return gulp.src(src)
    .pipe(plumber('Error Running Sass'))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(sass(sassOpts))
    .pipe(autoprefixer(autoprefixerOpts))
    .pipe(gulpIf(isDev, sourcemaps.write()))
    .pipe(gulpIf(isProd, cssnano()))
    .pipe(size({'title': 'styles'}))
    .pipe(gulp.dest(dest))
    .pipe(gulpIf(isDev, browserSync.reload({stream: true})))
})
