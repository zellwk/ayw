const _ = require('lodash')
const fs = require('fs')
const gutil = require('gulp-util')
const path = require('path')
const through = require('through2')
const nunjucks = require('nunjucks')
const nunjucksMarkdown = require('nunjucks-markdown')
const marked = require('marked')

// Get config from config.js
const config = require('../config')

function nunjuckTemplate (options) {
  var defaults = {
    templateDir: './src/templates',
    templateExt: '.nunjucks'
  }

  options = _.assign(defaults, options)

  return through.obj((file, enc, cb) => {
    if (file.isStream()) {
      cb(new gutil.PluginError('nunjucks-template', 'Streaming not supported'))
      return
    }

    let data = file.data || {}
    let templatePath

    /**
     * Figures out Template Path
     * Priority 1 : template in frontmatter
     * Fallback   : Use self
     */

    if (data.template) {
      templatePath = path.join(file.cwd, options.templateDir, data.template + options.templateExt)
      try {
        fs.openSync(templatePath, 'r')
      } catch (e) {
        ;
        cb(pluginError(`${data.template}${options.templateExt} not found in ${options.templateDir}`))
      }
    } else {
      templatePath = file.path
    }

    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(
      [options.templateDir, path.join(process.cwd(), 'src/pages')],
      {
        autoescape: true,
        watch: false,
        nocache: true
      }
     ))

    marked.setOptions(config.blog.markdownOptions)
    nunjucksMarkdown.register(env, marked)

    env.render(templatePath, data, (err, res) => {
      if (err) cb(pluginError(err))

      file.contents = new Buffer(res)
      cb(null, file)
    })
  })
}

function pluginError (message) {
  return new gutil.PluginError('nunjucks-template', message)
}

module.exports = nunjuckTemplate
