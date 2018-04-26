/* ---------------------------------------------------------------------------------------------------- *\
|*
|* REQUIRES
|*
\* ---------------------------------------------------------------------------------------------------- */

const browserSync      = require('browser-sync').create()
const babelify         = require('babelify')
const browserify       = require('browserify')
const buffer           = require('vinyl-buffer')
const source           = require('vinyl-source-stream')

const gulp             = require('gulp')
const gulpAutoprefixer = require('gulp-autoprefixer')
const gulpCssnano      = require('gulp-cssnano')
const gulpImagemin     = require('gulp-imagemin')
const gulpHtmlmin      = require('gulp-htmlmin')
const gulpNotify       = require('gulp-notify')
const gulpPlumber      = require('gulp-plumber')
const gulpPug          = require('gulp-pug')
const gulpStylus       = require('gulp-stylus')
const gulpUglify       = require('gulp-uglify')

/* ---------------------------------------------------------------------------------------------------- *\
|*
|* SETTINGS
|*
\* ---------------------------------------------------------------------------------------------------- */

/* -------------------------------------------------- *\
|* PATHS
\* -------------------------------------------------- */

const path =
{
	app  :
	{
		root    : './../app/',
		scripts : './../app/scripts/',
		styles  : './../app/styles/',
		views   : './../app/views/',
		assets  : './../app/assets/'
	},
	dist :
	{
		root    : './../dist/',
		scripts : './../dist/scripts/',
		styles  : './../dist/styles/',
		views   : './../dist/views/',
		assets  : './../dist/assets/'
	},
	src  :
	{
		root    : './../src/',
		scripts : './../src/scripts/',
		styles  : './../src/styles/',
		views   : './../src/views/',
		assets  : './../src/assets/'
	}
}

/* -------------------------------------------------- *\
|* MESSAGES
\* -------------------------------------------------- */

const message =
{
	compiled   : '<%= file.relative %> : file compiled',
	exported   : '<%= file.relative %> : file exported',
	transpiled : '<%= file.relative %> : file transpiled',
	error      : '<%= error.message %>'
}

/* ---------------------------------------------------------------------------------------------------- *\
|*
|* TASKS
|*
\* ---------------------------------------------------------------------------------------------------- */

/* -------------------------------------------------- *\
|* ASSETS
\* -------------------------------------------------- */

gulp.task('assets', () =>
{
	return gulp.src([`${path.src.assets}**/*.*`])
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Assets',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(path.app.assets))
		.pipe(browserSync.stream())
		.pipe(gulpNotify(
			{
				title   : 'Assets',
				message : `${message.exported}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* LIBS
\* -------------------------------------------------- */

gulp.task('libs', () =>
{
	// Update styles libraries
	gulp.src(`${path.src.styles}lib/*.css`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Styles lib',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(`${path.app.styles}`))
		.pipe(gulpNotify(
			{
				title   : 'Style libraries',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Update scripts libraries
	gulp.src(`${path.src.scripts}lib/*.js`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Scripts lib',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(`${path.app.scripts}`))
		.pipe(gulpNotify(
			{
				title   : 'Script libraries',
				message : `${message.exported}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* SCRIPTS
\* -------------------------------------------------- */

gulp.task('scripts', () =>
{
	return browserify(
		{
			debug   : true,
			entries : `${path.src.scripts}main.js`
		})
		.transform(babelify.configure(
			{
				presets : ['babel-preset-env'].map(require.resolve)
			}))
		.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Scripts',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(`${path.app.scripts}`))
		.pipe(browserSync.stream())
		.pipe(gulpNotify(
			{
				title   : 'Scripts',
				message : `${message.transpiled}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* STYLES
\* -------------------------------------------------- */

gulp.task('styles', () =>
{
	return gulp.src(`${path.src.styles}main.styl`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Styles',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulpStylus())
		.pipe(gulpAutoprefixer())
		.pipe(gulp.dest(path.app.styles))
		.pipe(browserSync.stream())
		.pipe(gulpNotify(
			{
				title   : 'Styles',
				message : `${message.compiled}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* VIEWS
\* -------------------------------------------------- */

gulp.task('views', () =>
{
	return gulp.src(`${path.src.views}*.pug`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Views',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulpPug(
			{
				pretty : true
			}))
		.pipe(gulp.dest(path.app.views))
		.pipe(browserSync.stream())
		.pipe(gulpNotify(
			{
				title   : 'Views',
				message : `${message.compiled}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* INDEX
\* -------------------------------------------------- */

gulp.task('index', () =>
{
	return gulp.src(`${path.src.root}index.pug`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Index',
						message : `${message.error}`,
						sound   : 'beep'
					})
			}))
		.pipe(gulpPug(
			{
				pretty : true
			}))
		.pipe(gulp.dest(path.app.root))
		.pipe(browserSync.stream())
		.pipe(gulpNotify(
			{
				title   : 'Index',
				message : `${message.compiled}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* WATCH
\* -------------------------------------------------- */

gulp.task('watch', () =>
{
	// Run browser
	browserSync.init(
		{
			server  : path.app.root,
			browser : 'Google Chrome',
			port    : 5000
		})

	// Watch assets
	gulp.watch(`${path.src.assets}**/*.*`, ['assets'])

	// Watch libs
	gulp.watch(
		[
			`${path.src.styles}lib/*.*`,
			`${path.src.scripts}lib/*.*`
		], ['libs'])

	// Watch scripts
	gulp.watch(
		[
			`${path.src.scripts}*.*`,
			`${path.src.scripts}components/*.*`
		], ['scripts'])

	// Watch styles
	gulp.watch(
		[
			`${path.src.styles}*.*`,
			`${path.src.styles}components/*.*`
		], ['styles'])

	// Watch views
	gulp.watch(
		[
			`${path.src.views}*.*`,
			`${path.src.views}includes/*.*`,
			`${path.src.views}includes/components/*.*`
		], ['views'])

	// Watch index
	gulp.watch(
		[
			`${path.src.root}*.*`,
			`${path.src.views}includes/*.*`,
			`${path.src.views}includes/components/*.*`
		], ['index'])
})

/* -------------------------------------------------- *\
|* PRODUCTION
\* -------------------------------------------------- */

gulp.task('production', () =>
{
	// Minify and export images
	gulp.src(`${path.app.assets}images/*.*`)
		.pipe(gulpImagemin())
		.pipe(gulp.dest(`${path.dist.assets}images/`))
		.pipe(gulpNotify(
			{
				title   : 'Images',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Export assets
	gulp.src(
		[
			`${path.app.assets}**/*.*`,
			`!${path.app.assets}images/*.*`
		])
		.pipe(gulp.dest(path.dist.assets))
		.pipe(gulpNotify(
			{
				title   : 'Assets',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Minify and export scripts
	gulp.src([`${path.app.scripts}*.js`])
		.pipe(gulpUglify())
		.pipe(gulp.dest(`${path.dist.scripts}`))
		.pipe(gulpNotify(
			{
				title   : 'Styles',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Minify and export styles
	gulp.src([`${path.app.styles}*.css`])
		.pipe(gulpCssnano())
		.pipe(gulp.dest(`${path.dist.styles}`))
		.pipe(gulpNotify(
			{
				title   : 'Scripts',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Minify and export views
	gulp.src([`${path.app.views}*.html`])
		.pipe(gulpHtmlmin(
			{
				collapseWhitespace : true
			}))
		.pipe(gulp.dest(path.dist.views))
		.pipe(gulpNotify(
			{
				title   : 'Views',
				message : `${message.exported}`,
				sound   : 'beep'
			}))

	// Minify and export index
	gulp.src(`${path.app.root}index.html`)
		.pipe(gulpHtmlmin(
			{
				collapseWhitespace : true
			}))
		.pipe(gulp.dest(path.dist.root))
		.pipe(gulpNotify(
			{
				title   : 'Index',
				message : `${message.exported}`,
				sound   : 'beep'
			}))
})

/* -------------------------------------------------- *\
|* DEFAULT
\* -------------------------------------------------- */

gulp.task('default', ['assets', 'libs', 'scripts', 'styles', 'views', 'index', 'watch'])