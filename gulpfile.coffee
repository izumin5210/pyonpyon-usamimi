gulp        = require 'gulp'
concat      = require 'gulp-concat'
uglify      = require 'gulp-uglify'
coffee      = require 'gulp-coffee'
sass        = require 'gulp-ruby-sass'
pleeease    = require 'gulp-pleeease'
plumber     = require 'gulp-plumber'
imagemin    = require 'gulp-imagemin'
cache       = require 'gulp-cache'
bower       = require 'bower'
browserSync = require 'browser-sync'

config =
  src: 'app'
  dist: 'build'
  tmp: '.tmp'

config.dir =
  js: 'javascripts'
  css: 'stylesheets'
  bower: 'bower_components'

config.path =
  js: "#{config.src}/#{config.dir.js}"
  css: "#{config.src}/#{config.dir.css}"

config.output =
  js: "#{config.tmp}/#{config.dir.js}"
  css: "#{config.tmp}/#{config.dir.css}"

config.bower =
  js: [
    "#{config.dir.bower}/angular/angular.min.js"
    "#{config.dir.bower}/onsenui/build/js/onsen.min.js"
    "#{config.dir.bower}/jquery/dist/jquery.min.js"
    "#{config.dir.bower}/bootstrap-sass-official/assets/javascripts/bootstrap.js"
    "#{config.dir.bower}/lodash/dist/lodash.compat.min.js"
    "#{config.dir.bower}/konashi-bridge.js/js/konashi-bridge.js"
  ]
  css: [
    "#{config.dir.bower}/onsenui/build/css/onsenui.css"
    "#{config.dir.bower}/onsenui/build/css/onsen-css-components.css"
    "#{config.dir.bower}/fontawesome/css/font-awesome.min.css"
  ]
  sass: [
    "#{config.dir.bower}/bootstrap-sass-official/assets/stylesheets"
  ]
  fonts: [
    "#{config.dir.bower}/fontawesome/fonts/*"
    "#{config.dir.bower}/bootstrap-sass-official/assets/fonts/bootstrap/*"
  ]

load_components = ->
  gulp.src config.bower.js
    .pipe uglify()
    .pipe concat 'vendor.js'
    .pipe gulp.dest config.output.js

  gulp.src config.bower.css
    .pipe concat 'vendor.css'
    .pipe gulp.dest config.output.css

  gulp.src config.bower.fonts
    .pipe gulp.dest "#{config.tmp}/fonts"

gulp.task 'bower-init', ->
  bower.commands.install().on 'end', (r) -> load_components()

gulp.task 'bower-update', ->
  bower.commands.update().on 'end', (r) -> load_components()

gulp.task 'coffee', ->
  gulp.src "#{config.path.js}/**/*.coffee"
    .pipe plumber()
    .pipe coffee(bare: true)
    .pipe gulp.dest config.output.js
    .pipe browserSync.reload(stream: true)

gulp.task 'sass', ->
  gulp.src "#{config.path.css}/style.scss"
    .pipe plumber()
    .pipe sass(
      loadPath: config.bower.sass
      bundleExec: true
    )
    .pipe pleeease()
    .pipe gulp.dest config.output.css
    .pipe browserSync.reload(stream: true)

gulp.task 'images', ->
  gulp.src "#{config.src}/images"
    .pipe cache imagemin
      progressive: true
      interlaced: true
    .pipe gulp.dest "#{config.tmp}/images"
    .pipe browserSync.reload(stream: true)

gulp.task 'reload', ->
  browserSync.reload()

gulp.task 'server', ->
  browserSync.init
    server:
      baseDir: [config.src, config.tmp]
    open: true

gulp.task 'watch', ->
  gulp.watch "#{config.src}/**/*.html", ['reload']
  gulp.watch "#{config.path.css}/**/*.scss", ['sass']
  gulp.watch "#{config.path.js}/**/*.coffee", ['coffee']
  gulp.watch "#{config.src}/images/**/*", ['images']

gulp.task 'buildDev', ['coffee', 'sass', 'images']
gulp.task 'default', ['buildDev', 'server', 'watch']
