const { src, dest } = require('gulp')
const { input, output } = require('./_config')

const videos = _ => {
  return src(input + '/videos/**/*')
    .pipe(dest(output + '/videos'))
}

module.exports = videos
