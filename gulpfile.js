const { src, dest, watch, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const terser = require('gulp-terser-js');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');

const paths = {
    css: 'src/css/**/*.css',
    js: 'src/js/**/*.js',
    images: 'src/img/**/*'
};

function css() {
    return src(paths.css)
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'));
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'));
}

function images() {
    return src(paths.images)
        .pipe(cache(imagemin({ optimizationLevel: 3 })))
        .pipe(dest('./build/img'))
        .pipe(notify({ message: 'Image completed'}));
}

function versionWebp() {
    return src(paths.images)
        .pipe(webp())
        .pipe(dest('./build/img'))
        .pipe(notify({ message: 'Webp Image completed'}));
}

function watchFiles() {
    watch(paths.css, css);
    watch(paths.js, javascript);
    watch(paths.images, images);
    watch(paths.images, versionWebp);
}

exports.default = parallel(css, javascript, images, versionWebp, watchFiles);