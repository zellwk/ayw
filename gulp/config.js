const environment = require('../env')

var env = environment.env
var src = environment.src
var dest = environment.dest

var config = {
  env: env,
  src: src,
  dest: dest,

  blog: {
    articlesPerPage: 20,
    blogDir: 'blog',
    date: {
      fileDateFormat: 'YYYY-MM-DD',
      outputDateFormat: 'Do MMM YYYY'
    },
    markdownOptions: {
      smartypants: true,
      gfm: true
    },
    postSrc: src + '/posts/*.{md,nj,nunjucks}',
    postDest: dest + '/blog',
    summaryMarker: '<!--more-->',
    pageSrc: src + '/pages/**/*.{nj,nunjucks}',
    pageDest: dest,
    tags: {
      basename: '/tags'
    },
    watch: [
      src + '/templates/**/*',
      'data/**/*.json'
    ],
    regenerateArchives: false
  },

  browserSync: {
    server: { baseDir: dest },
    open: false
  }
}

module.exports = config
