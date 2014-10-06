var gulp = require('gulp'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    newer = require('gulp-newer');

module.exports = function(buildOptions) {
    gulp.task('copy-images', function() {
        return (
            gulp
                .src([
                    'source/images/**/*.{jpg,jpeg,gif,png}',
                    '!source/images/**/_*'
                ])
                .pipe(newer('dist/assets/images/'))
                .pipe(buildOptions.release ? imagemin() : gutil.noop())
                .pipe(gulp.dest('dist/assets/images/'))
        );
    });

    return function(callback) {
        runSequence('copy-images', callback);
    };
};