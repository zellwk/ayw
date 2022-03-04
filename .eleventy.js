const fs = require('fs')
const path = require('path')
const markdown = require('./eleventy/markdown')
const nunjucks = require('./eleventy/nunjucks')
const querystring = require('querystring')

const { input, output } = require('./gulp/_config')

module.exports = eleventyConfig => {
  // Markdown
  eleventyConfig.setLibrary('md', markdown.lib)
  eleventyConfig.addPairedShortcode('markdown', markdown.pairedMarkdown)
  eleventyConfig.addPairedShortcode('markdownInline', markdown.inline)
  eleventyConfig.addFilter('markdown', markdown.inline)

  // Pages
  // Override permalink to remove /page prefix
  eleventyConfig.addFilter('pagePathOverride', content => {
    const regex = /page\/(.*).njk/
    const match = content.match(regex)
    return match[1]
  })

  eleventyConfig.addPairedShortcode('pullquote', content => {
    content = markdown.pairedMarkdown(content)
    return `<div class="pull-quote">
  ${content}
</div>`
  })

  function toPresentableName (name) {
    return name.replace('-', ' ').replace(/\w\S*/g, text => {
      return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
    })
  }

  eleventyConfig.addShortcode('testimonial', name => {
    const presentableName = toPresentableName(name)
    const pathToContent = path.resolve(
      __dirname,
      'src/_includes/testimonials',
      name + '.md'
    )

    let content = fs.readFileSync(pathToContent).toString()
    content = markdown.pairedMarkdown(content)

    return `<div class="c-testimonial o-text" data-theme="guided-instruction">
  <svg class="star" viewbox="0 0 16 17">
    <use xlink:href="#star1" />
  </svg>
  ${content}
  <img src="/images/quotes/${name}.jpg" alt="Picture of ${presentableName}">
  <p>${presentableName}</p>
</div>`
  })

  // Tier Management
  const tiers = {
    welcome: {
      price: 49,
      splitPrice: 0
    },
    starter: {
      price: 225,
      splitPrice: 49,
      link: 'learn-javascript-starter'
    },
    mastery: {
      price: 495,
      splitPrice: 99,
      link: 'learn-javascript-mastery'
    },
    guided: {
      price: 995,
      splitPrice: 199,
      link: 'learn-javascript-guided'
    }
  }

  function getCoupon (tier, currentTier, splitPayment) {
    if (currentTier === 'welcome') {
      return 'UPGRADE-FROM-WO'
    }

    if (currentTier === 'starter') {
      if (splitPayment) return 'UG-FRM-STARTER-SPLIT'
      return 'UPGRADE-FROM-STARTER'
    }
  }

  eleventyConfig.addShortcode(
    'PurchaseLink',
    (tier, currentTier, splitPayment) => {
      const tierInfo = tiers[tier]
      const productLink = `https://store.zellwk.com/${tierInfo.link}`
      const plan = splitPayment ? 2 : 1
      const coupon = getCoupon(tier, currentTier, splitPayment)

      const query = querystring.encode({ plan, coupon })

      return `${productLink}/?${query}`
    }
  )

  eleventyConfig.addShortcode('PurchasePrice', (tier, currentTier) => {
    const tierInfo = tiers[tier]
    const currentTierInfo = tiers[currentTier]

    if (!currentTier) return `$${tierInfo.price}`

    return `<strike>$${tierInfo.price}</strike> $${tierInfo.price -
      currentTierInfo.price}`
  })

  eleventyConfig.addShortcode(
    'SplitPaymentPurchasePrice',
    (tier, currentTier) => {
      const tierInfo = tiers[tier]
      const currentTierInfo = tiers[currentTier]

      if (!currentTier) return `$${tierInfo.splitPrice}`
      if (currentTierInfo.splitPrice === 0) return `$${tierInfo.splitPrice}`

      return `<strike>$${tierInfo.splitPrice}</strike> $${tierInfo.splitPrice -
        currentTierInfo.splitPrice}`
    }
  )

  return {
    dir: {
      input,
      output,
      includes: '_includes'
    },
    templateFormats: ['njk', 'md'],
    passthroughFileCopy: true
  }
}
