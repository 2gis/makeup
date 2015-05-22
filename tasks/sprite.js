var gulp = require('gulp'),
    gutil = require('gulp-util'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    runSequence = require('run-sequence'),
    newer = require('gulp-newer');

module.exports = function(buildOptions) {

    // Use it carefully
    gulp.task('rasterize-svg', function() {
        var svg2png = require('gulp-svg2png');

        return (
            gulp
                .src([
                    'source/svg/**/*.svg',
                    '!source/svg/**/_*.svg'
                ])
                .pipe(newer({ dest: 'source/png/', ext: '.png' }))
                .pipe(svg2png())
                .pipe(gulp.dest('source/png/'))
        );
    });

    gulp.task('copy-png', function() {
        return (
            gulp
                .src([
                    'source/png/**/*.png',
                    '!source/png/**/_*.png'
                ])
                .pipe(newer({ dest: 'dist/assets/png/', ext: '.png' }))
                .pipe(buildOptions.release ? imagemin() : gutil.noop())
                .pipe(gulp.dest('dist/assets/png/'))
        );
    });

    gulp.task('copy-svg', function() {
        return (
            gulp
                .src([
                    'source/svg/**/*.svg',
                    '!source/svg/**/_*'
                ])
                .pipe(newer('dist/assets/svg/'))
                .pipe(buildOptions.release ? svgmin() : gutil.noop())
                .pipe(gulp.dest('dist/assets/svg/'))
        );
    });

    gulp.task('build-sprite', function() {
        var sprite;

        sprite = gulp
            .src([
                'source/png/**/*.png',
                '!source/png/**/_*.png'
            ])
            .pipe(spritesmith({
                algorithm: 'binary-tree',
                imgName: 'makeup-sprite.png',
                cssName: 'sprite.less',
                cssTemplate: 'source/lessTemplates/sprite.less.mustache'
            }));

        sprite.css.pipe(gulp.dest('temp/'));

        return sprite.img
            .pipe(buildOptions.release ? imagemin() : gutil.noop())
            .pipe(gulp.dest('dist/assets/'));
    });

    return function(callback) {
        runSequence('copy-svg', 'copy-png', 'build-sprite', callback);
    };
};
