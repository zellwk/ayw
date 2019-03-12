const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const standard = require('gulp-standard')
const browserSync = require('browser-sync')
const gulpIf = require('gulp-if')
const config = require('../config')
const plumber = require('../custom_modules/plumber')
const size = require('gulp-size')
const named = require('vinyl-named')

const isDev = config.env === 'dev'

gulp.task('lint-js', () => {
  return gulp.src([
    'src/js/**/*.js',
    '!src/js/lib/**/*.js'
  ])
  .pipe(plumber('Error Linting JS'))
  .pipe(standard())
  .pipe(standard.reporter('default'))
  .pipe(gulp.dest('src/js'))
})

gulp.task('js', ['lint-js'], function () {
  return gulp.src(webpackConfig.src)
  .pipe(named())
  .pipe(plumber('Error Running Webpack'))
  .pipe(webpackStream(webpackConfig.options, webpack))
  .pipe(gulp.dest(webpackConfig.dest))
  .pipe(gulpIf(isDev, browserSync.reload({stream: true})))
  .pipe(size({'title': 'JS'}))
})

const webpackPlugins = isDev ? [] : [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})]

const webpackConfig = {
  src: [
    config.src + '/js/main.js',
    config.src + '/js/lib/**/*.js'
  ],
  dest: config.dest + '/js',
  options: {
    watch: isDev,
    output: {
      filename: '[name].js',
      pathinfo: true
    },
    externals: {
      TweenLite: 'TweenLite'
    },
    devtool: '#source-map',
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['es2015', {modules: false}], 'stage-0'],
            plugins: ['syntax-async-functions']
          }
        }
      }, {
        test: /\.(nunj|nunjucks)$/,
        loader: 'nunjucks-loader'
      }]
    },
    plugins: webpackPlugins
  }
}
