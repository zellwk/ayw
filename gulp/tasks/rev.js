const gulp = require('gulp')
const rev = require('gulp-rev')
const through = require('through2')
const path = require('path')

gulp.task('rev', () => {
  return gulp.src(['dist/**/*.{js,css}'])
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'))
})

gulp.task('modify-rev', ['rev'], () => {
  return gulp.src('dist/rev-manifest.json')
    .pipe(modifyRevPaths())
    .pipe(gulp.dest('dist'))
})

// Modify rev paths for Nunjucks to handle
function modifyRevPaths () {
  return through.obj(function (file, enc, cb) {
    let revs = JSON.parse(file.contents.toString())

    let r = Object.keys(revs).reduce((acc, curr) => {
      let extname = path.extname(curr)
      let filename = path.basename(curr, extname)
      let revisionedAsset = removeDot(extname) + capitalizeFirstLetter(filename)
      acc[revisionedAsset] = revs[curr]
      return acc
    }, {})

    file.contents = new Buffer(JSON.stringify(r, null, 2))

    this.push(file)
    cb()
  })
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function removeDot (string) {
  return string.replace('.', '')
}
