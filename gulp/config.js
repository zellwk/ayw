import minimist from 'minimist';

let processArgs = minimist(process.argv);

let env = 'dev';
let src = './src';
let dev = './dev';
let dist = './dist';
let dest = dev;

// Sets env and dest for production environments
if (processArgs.prod || processArgs.production) {
  env = 'prod';
  dest = dist;
}

var config = {
  env: env,
  src: src,
  dest: dest,

  autoprefixer: {
    browsers: ['last 2 versions'],
  },

  blog: {
    articlesPerPage: 5,
    blogDir: 'blog',
    globalData: './data/_data.json',
    markdownOptions: {
      smartypants: true,
      gfm: true,
      // Highlights code with highlight.js
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
      }
    },
    postSrc: src + '/posts/*.{md,nj,nunjucks}',
    postDest: dest + '/blog',
    summaryMarker: '<!--more-->',
    pageSrc: src + '/pages/**/*.{nj,nunjucks}',
    pageDest: dest,
    watch: [
      src + '/templates/**/*.{nunjucks,md}',
      'data/**/*.json'
    ]
  },

  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
    },
    host: 'localhost',
    port: 3000,
    open: false
    // proxy: "yourlocal.dev"
    // browser: 'google chrome',
  },

  fonts: {
    src: src + '/fonts/**/*',
    dest: dest + '/fonts'
  },

  images: {
    src: [
      src + '/images/**/*.{png,jpeg,jpg,gif}',
      '!' + src + '/images/sprites/*'
    ],
    dest: dest + '/images',
    opts: {
      interlaced: true,
      optimizationLevel: 5,
      progressive: true
    }
  },

  jspm: {
    src: src + '/js/main',
    dest: dest + '/js/main.min.js',
    watch: src + '/js/**/*.js',
    jspmConfigPath: './jspm.config.js'
  },

  sass: {
    src: src + '/scss/**/*.{scss,sass}',
    dest: dest + '/css',
    opts: {
      includePaths: [
        src + '/bower_components',
        './node_modules'
      ],
    }
  },

  scsslint: {
    src: [src + '/scss/**/*.scss',
      '!' + src + '/scss/_sprites.scss'
    ]
  },

  sprites: {
    src: src + '/images/sprites/*',
    dest: src + '/scss',
    opts: {
      padding: 2,
      imgName: 'sprites.png',
      retinaSrcFilter: src + '/images/sprites/*@2x.{png,jpg,jpeg}',
      retinaImgName: 'sprites@2x.png',
      cssName: '_sprites.scss',
      cssVarMap: function(sprite) {
        sprite.name = 'sprite-' + sprite.name;
      },
    }
  },

  webpack: {
    src: src + '/js/main.js',
    dest: dest + '/js',
    options: {
      watch: env === 'prod' ? false : true,
      output: {
        filename: '[name].js',
        pathinfo: true
      },
      devtool: 'eval',
      module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            // Remove babel-runtime for production sites
            query: env !== 'prod' ? {
              optional: ['runtime'],
              stage: 0
            } : {},
          }],
        // TODO: Explore Common Chunks plugin for optimization
        // TODO: explore Bower plugin
      }
    }

  }
}

module.exports = config;
