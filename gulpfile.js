const	gulp			= require('gulp'),
		autoprefixer	= require('autoprefixer'),
		bourbon			= require('bourbon').includePaths,
		cssnano			= require('cssnano'),
		del				= require('del'),
		imagemin		= require('gulp-imagemin'),
		postcss			= require('gulp-postcss'),
		pug				= require('gulp-pug'),
		sass			= require('gulp-sass')(require('sass')),
		sourcemaps		= require('gulp-sourcemaps'),
		browsersync		= require('browser-sync').create()
		require('dotenv').config();

/*----- directories -----------------------------------------------*/
let dir = {
	src:	'./src/',		// where our source files live
	dest:	'./public/',		// where we build our files to
};

dir.dest = process.env.NODE_ENV === 'dev' ? './static/' : './build/';

/*----- clobber the build directory -------------------------------*/
function clean() {
	return del(
		['./build/**', '!build/']
	);
}


/*----- compile Pug files to html ---------------------------------*/
const htmlConfig = {
	src:	dir.src		+ 'pug/pages/*.pug',
	watch:	dir.src		+ 'pug/**/*.pug',
	dest:	dir.dest,
};

function html() {
	return gulp.src(htmlConfig.src)
		.pipe(pug())
		.pipe(gulp.dest(htmlConfig.dest))
	;
}

/*----- compile SASS to CSS ---------------------------------------*/
const cssConfig = {
	src:	dir.src		+ 'styles/main.scss',
	watch:	dir.src		+ 'styles/**/*.{css,sass,scss}',
	dist:	dir.dest,

	postCSS: [
		autoprefixer(), // browser options moved to package.json
		cssnano()
	]
};

function css() {
	return gulp.src(cssConfig.src)
		// we include node_modules so we can @import normalize.css installed by npm
		.pipe(sass({includePaths: ['node_modules', bourbon]}).on('error', sass.logError))
		// pass it through autoprefixer (with sourcemap)
		.pipe(sourcemaps.init())
		.pipe(postcss(cssConfig.postCSS))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(cssConfig.dist))
		.pipe(browsersync.stream())
	;
}

// Javascript
const scriptConfig = {
	src:	dir.src		+ 'js/*.js',
	watch:	dir.src		+ 'js/**/*.js',
	dest:	dir.dest    + 'js/'
};


function script() {
	return gulp
	  .src(scriptConfig.src)
	  .pipe(gulp.dest(scriptConfig.dest))
	;
  }


/*----- process images --------------------------------------------*/
const imgConfig = {
	src:	dir.src		+ 'assets/images/**/*',
	watch:	dir.src		+ 'assets/images/**/*',
	dist:	dir.dest	+ 'assets/images/',

	plugins: [
		imagemin.gifsicle({interlaced: true}),
		imagemin.mozjpeg({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{
					removeViewBox: false,
					removeDoctype: false,
					collapseGroups: false,
				}
			]
		})
	]
};

function images() {
	return gulp.src(imgConfig.src)
		.pipe(imagemin(imgConfig.plugins))
		.pipe(gulp.dest(imgConfig.dist))
		.pipe(browsersync.stream())
	;
}


/*----- browserSync -----------------------------------------------*/
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: dir.dest,
		},
		// browser:	'msedge developer edition',
		notify:	true,
		open: false,
	});
	done();
}

// browserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}


/*----- watch tasks -----------------------------------------------*/
function watchFiles() {
	gulp.watch(cssConfig.watch, css);
	gulp.watch(htmlConfig.watch, html);
	gulp.watch(scriptConfig.watch, script)
	gulp.watch(
		[
			dir.dest		+ '*.html',
		],
		gulp.series(browserSyncReload)
	);
	gulp.watch(imgConfig.watch, images);
}


/*----- Setup Production Build ---------------------------------------------*/
async function production() {
	await build();
}


/*----- gulp routines ---------------------------------------------*/
const build		= gulp.series(gulp.parallel(html, script), gulp.parallel(css, images));
const watch		= gulp.parallel(watchFiles, browserSync);


/*----- export tasks ----------------------------------------------*/
exports.clean	= clean;
exports.html	= html;
exports.css		= css;
exports.images	= images;
exports.script	= script;
exports.prod = production;
exports.build	= build;
exports.watch	= watch;
exports.default	= gulp.series(build, watch);


/*-----------------------------------------------------------------*/
/*----- NOTES -----------------------------------------------------*/
