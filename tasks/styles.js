var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer-core');

module.exports = function(buildOptions) {

    gulp.task('css.modern', function() {
        return (
            gulp
                .src([
                    './temp/sprite.less',
                    './source/less/mixins.less',
                    './source/less/svg.less',
                    './source/less/common.less',
                    './source/blocks/*/*.less'
                ])
                .pipe(concat('makeup.css'))
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(postcss([
                    autoprefixer({ browsers: ['last 2 version', '> 5%'] })
                ]))
                .pipe(buildOptions.release ? csso() : gutil.noop())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist/'))
        );
    });

    gulp.task('css.ie', function() {
        return (
            gulp
                .src([
                    './temp/sprite.less',
                    './source/less/mixins.less',
                    './source/less/png.less',
                    './source/less/common.less',
                    './source/less/ie.less',
                    './source/blocks/*/*.less'
                ])
                .pipe(concat('makeup.ie.css'))
                .pipe(plumber())
                .pipe(sourcemaps.init())
                .pipe(less())
                .pipe(postcss([
                    autoprefixer({ browsers: ['last 2 version', '> 5%', 'ie >= 8'] })
                ]))
                .pipe(buildOptions.release ? csso() : gutil.noop())
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('dist/'))
        );
    });

    return function(callback) {
        runSequence(['css.ie', 'css.modern'], callback);
    };
};
