const nunjucks = require('nunjucks')

// TODO: Update to config...
const env = new nunjucks.Environment(
  new nunjucks.FileSystemLoader('src/_includes'),
  {
    throwOnUndefined: true
  }
)

const render = (src, ctx) => {
  const tmpl = env.getTemplate(src)
  return tmpl.render(ctx)
}

const renderString = (template, ctx) => {
  const tmpl = new nunjucks.Template(template, env)
  return tmpl.render(ctx)
}

// TODO: Some error with render and renderString in eleventyjs...
// https://github.com/11ty/eleventy/issues/354
module.exports = {
  env,
  render,
  renderString
  // renderString: env.renderString
}
