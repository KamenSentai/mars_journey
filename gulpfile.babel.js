/**
 * Imports
 */

// Packages
import gulp            from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync     from 'browser-sync'
import babelify        from 'babelify'
import browserify      from 'browserify'
import source          from 'vinyl-source-stream'
import buffer          from 'vinyl-buffer'
import watchify        from 'watchify'

// Loader
const $ = gulpLoadPlugins()

// Session
browserSync.create()

/**
 * Definition
 */

// Messages
const message = {
  compiled   : '<%= file.relative %>: file compiled',
  transpiled : '<%= file.relative %>: file transpiled',
  updated    : '<%= file.relative %>: file updated',
  minified   : '<%= file.relative %>: file minified',
  cleaned    : '<%= file.relative %>: file cleaned',
  error      : '<%= error.message %>'
}

// Path
const server  = 'htdocs'
const root    = 'dist'
const folders = process.cwd().split('/')

let local = ''
let index = 0

for (const folder of folders) {
  if (folder == server) {
    index = folders.indexOf(server)
    for (let i = index + 1 ; i < folders.length ; i++) {
      local += `${folders[i]}/`
    }
    local += `${root}/`
    break
  }
}

/**
 * Configuration
 */

// Server
gulp.task('server', ['assets', 'styles', 'scripts', 'templates'], () => {
  browserSync.init({
    proxy   : `http://localhost/${local}`,
    browser : 'Google Chrome'
  })
  gulp.watch([
    'src/styles/**/*.styl',
    'src/styles/*.styl'
  ], ['styles'])
  gulp.watch([
    'src/index.pug'
  ], ['templates'])
})

// Assets
gulp.task('assets', () => {
  return gulp.src('src/assets/**/*.*')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/assets/'))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Assets',
      message : message.compiled,
      sound   : 'beep'
    }))
})

// Styles
gulp.task('styles', () => {
  return gulp.src('src/styles/app.styl')
    .pipe($.plumber())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.stylus())
    .on('error', $.notify.onError({
      title   : 'Styles',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Styles',
      message : message.compiled,
      sound   : 'beep'
    }))
})

// Scripts
let bundler = null

const bundle = () => {
  bundler.bundle()
    .pipe($.plumber())
    .on('error', $.notify.onError({
      title   : 'Scripts',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Scripts',
      message : message.transpiled,
      sound   : 'beep'
    }))
}

gulp.task('scripts', () => {
  bundler = browserify({
    entries : 'src/scripts/app.js',
    debug   : true,
    paths   : ['./node_modules', 'src/scripts/']
  })
  .transform(babelify)
  bundler.plugin(watchify)
  bundler.on('update', bundle)
  bundle()
})

// Templates
gulp.task('templates', () => {
  return gulp.src([
    'src/index.pug'
  ])
    .pipe($.plumber())
		.pipe($.pug({
      pretty : true
    }))
		.pipe(gulp.dest('dist/'))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Template',
      message : message.updated,
      sound   : 'beep'
    }))
})

// CSS
gulp.task('compile', () => {
  return gulp.src('src/styles/app.css')
    .pipe($.cssnano())
    .on('error', $.notify.onError({
      title   : 'Styles',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(gulp.dest('dist/styles/'))
    .pipe($.notify({
      title   : 'Styles',
      message : message.minified,
      sound   : 'beep'
    }))
})

// JS
gulp.task('transpile', () => {
  return gulp.src('src/scripts/app.js')
    .pipe($.uglify())
    .on('error', $.notify.onError({
      title   : 'Scripts',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe($.notify({
      title   : 'Scripts',
      message : message.minified,
      sound   : 'beep'
    }))
})

// Images
gulp.task('minify', () => {
  return gulp.src('dist/assets/images/*.+(png|jpg|jpeg|gif|svg)')
    .pipe($.imagemin())
    .on('error', $.notify.onError({
      title   : 'Images',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(gulp.dest('dist/assets/images/'))
    .pipe($.notify({
      title   : 'Images',
      message : message.minified,
      sound   : 'beep'
    }))
})

// Maps
gulp.task('clear', () => {
  return gulp.src([
    'dist/scripts/app.js.map',
    'dist/styles/app.css.map'
  ])
    .pipe($.clean({
      force: true,
      read: false
    }))
    .on('error', $.notify.onError({
      title   : 'Maps',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe($.notify({
      title   : 'Maps',
      message : message.cleaned,
      sound   : 'beep'
    }))
})

// Production
gulp.task('prod', ['compile', 'transpile', 'minify', 'clear'])

// Run
gulp.task('default', ['server'])
