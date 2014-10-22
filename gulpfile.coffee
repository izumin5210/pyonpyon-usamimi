gulp        = require 'gulp'
cache       = require 'gulp-cache'
coffee      = require 'gulp-coffee'
concat      = require 'gulp-concat'
imagemin    = require 'gulp-imagemin'
pleeease    = require 'gulp-pleeease'
plumber     = require 'gulp-plumber'
sass        = require 'gulp-ruby-sass'
uglify      = require 'gulp-uglify'
usermin     = require 'gulp-usemin'
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
  sass: [
    "#{config.dir.bower}/bootstrap-sass-official/assets/stylesheets"
  ]
  fonts: [
    "#{config.dir.bower}/fontawesome/fonts/*"
    "#{config.dir.bower}/bootstrap-sass-official/assets/fonts/bootstrap/*"
  ]

load_components = ->
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
      baseDir: [config.src, config.tmp, '.']
    open: true

gulp.task 'watch', ->
  gulp.watch "#{config.src}/**/*.html", ['reload']
  gulp.watch "#{config.path.css}/**/*.scss", ['sass']
  gulp.watch "#{config.path.js}/**/*.coffee", ['coffee']
  gulp.watch "#{config.src}/images/**/*", ['images']

gulp.task 'buildDev', ['coffee', 'sass', 'images']
gulp.task 'default', ['buildDev', 'server', 'watch']
