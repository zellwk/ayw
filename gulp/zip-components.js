const fs = require('fs')
const fsPromises = fs.promises
const archiver = require('archiver')

function zipFolder ({
  inputPath,
  component,
  filename
}) {
  const output = fs.createWriteStream(`dist/${inputPath}.zip`)
  const archive = archiver('zip', { zlib: { level: 9 } })

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on('close', function () {
    console.log(`Zipped ${inputPath}`, archive.pointer() + ' total bytes')
  })

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function () {
    console.log('Data has been drained')
  })

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
    // log warning
    } else {
    // throw error
      throw err
    }
  })

  // good practice to catch this error explicitly
  archive.on('error', function (err) {
    throw err
  })

  // pipe archive data to the file
  archive.pipe(output)
  archive.directory(inputPath, `${component}-${filename}`)
  archive.finalize()
}

async function zipComponents (cb) {
  // Make directory first (if not present)
  try {
    await fsPromises.mkdir('dist')
    await fsPromises.mkdir('dist/components')
  } catch (e) { }

  const components = await fsPromises.readdir('components')
  for (const component of components) {
    const componentPath = `components/${component}`
    const stat = await fsPromises.stat(componentPath)
    if (!stat.isDirectory()) continue

    // Makes the component folder first (if not available)
    try {
      await fsPromises.mkdir(`dist/${componentPath}`)
    } catch (e) {}

    const sources = await fsPromises.readdir(componentPath)

    for (const source of sources) {
      const sourcePath = `${componentPath}/${source}`
      const stat = await fsPromises.stat(sourcePath)
      if (!stat.isDirectory()) continue

      zipFolder({
        inputPath: `${sourcePath}`,
        component,
        filename: source
      })
    }
  }
}

module.exports = zipComponents
