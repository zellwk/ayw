const browserSync = require('browser-sync')
const server = browserSync.create()

async function reload () {
  return server.reload()
}

const serve = done => {
  server.init({
    open: false,
    server: './dist'
  })

  done()
}

exports.reload = reload
exports.browserSync = serve
