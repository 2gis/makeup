var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename');

var baseStylesheets = [
        './temp/sprite.less',
        './source/less/mixins.less',
        './source/less/reset.less',
        './source/less/common.less',
        './source/blocks/*/*.less'
    ];

module.exports = function(buildOptions) {
    gulp.task('css.modern', function() {
        var files = baseStylesheets;

        files.unshift('./source/less/svg.less');

        console.log(process.cwd());

        return (
            gulp
                .src(files)
                .pipe(concat('makeup.css'))
                .pipe(plumber())
                .pipe(less())
                .pipe(buildOptions.release ? csso() : gutil.noop())
                .pipe(gulp.dest('dist/'))
        );
    });

    gulp.task('css.ie', function() {
        var files = baseStylesheets;

        files.unshift('./source/less/png.less');

        return (
            gulp
                .src(files)
                .pipe(concat('makeup.ie.css'))
                .pipe(plumber())
                .pipe(less())
                .pipe(buildOptions.release ? csso() : gutil.noop())
                .pipe(gulp.dest('dist/'))
        );
    });

    return function(callback) {
        runSequence(['css.modern'], callback);
    };
};