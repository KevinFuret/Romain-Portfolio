var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var minifyCSS = require('gulp-csso');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var sync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var pxtorem = require('gulp-pxtorem');
var plumber = require('gulp-plumber');

/////////////
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var processors = [
    autoprefixer
];
////////////////

var isProd = process.env.NODE_ENV === 'production';
var dist = "dist";

/**
 * HTML
 */


function html() {
    return  gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(sync.stream());
}


/**
 * SCSS
 */

function scss() {
    return gulp.src('src/scss/main.scss')
        .pipe(plumber())
        .pipe(gulpif(!isProd, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(isProd, minifyCSS()))
        .pipe(postcss(processors))
        .pipe(pxtorem())
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(gulp.dest(dist + '/css'))
        .pipe(sync.stream())
}

/**
 * JS
 */

function js() {
    return browserify({entries: ['src/js/main.js'], debug: true})
        .transform(babelify, {presets: 'es2015'})
        .bundle()
        .on('error', function(err){
            console.log(err.stack);
            this.emit('end');

            sync.notify("Compiling, please wait!");
        })
        .pipe(plumber())
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpif(!isProd, sourcemaps.init({loadMaps: true})))
        .pipe(uglify())
        .pipe(gulpif(!isProd, sourcemaps.write('.')))
        .pipe(gulp.dest(dist + '/js'))
        .pipe(sync.stream());
};

/**
 * IMAGES
 */

function images() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest(dist + '/images'));
}

/**
 * FONTS
 */

function fonts() {
    return gulp.src('src/fonts/**/*')
    // .pipe(gulp.dest(`${dist}/fonts.scss`));
        .pipe(gulp.dest(dist + '/fonts'));
}

/**
 * GLOBAL
 */

function clean() {
    return del([dist]);
}


gulp.task('clean', clean);

gulp.task('build', gulp.series(clean, gulp.parallel(html, scss, js, images, fonts)));

gulp.task('default', gulp.parallel(html, scss, js, images, fonts, function(done) {
    sync.init({
        server: {
            baseDir: 'dist'
        }
        //  proxy: "http://localhost:3000/hetic-p2020-12/dist/"
    });

    gulp.watch('src/*.html', html);
    gulp.watch('src/**/*.scss', scss);
    gulp.watch('src/**/*.js', js);

    done();
}));
