var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename');

module.exports = function(buildOptions) {
    gulp.task('css.modern', function() {
        return (
            gulp
                .src([
                    './temp/sprite.less',
                    './source/less/mixins.less',
                    './source/less/svg.less',
                    './source/less/reset.less',
                    './source/less/common.less',
                    './source/blocks/*/*.less'
                ])
                .pipe(concat('makeup.css'))
                .pipe(plumber())
                .pipe(less())
                .pipe(buildOptions.release ? csso() : gutil.noop())
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
                    './source/less/reset.less',
                    './source/less/common.less',
                    './source/less/ie.less',
                    './source/blocks/*/*.less'
                ])
                .pipe(concat('makeup.ie.css'))
                .pipe(plumber())
                .pipe(less())
                .pipe(buildOptions.release ? csso() : gutil.noop())
                .pipe(gulp.dest('dist/'))
        );
    });

    return function(callback) {
        runSequence(['css.ie', 'css.modern'], callback);
    };
};