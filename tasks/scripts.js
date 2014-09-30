var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    headerfooter = require('gulp-headerfooter'),
    uglify = require('gulp-uglify')
    runSequence = require('run-sequence'),
    fs = require('fs');

module.exports = function(buildOptions) {
    var header = fs.readFileSync('./source/jsPartials/header.js');
    var footer = fs.readFileSync('./source/jsPartials/footer.js');


    gulp.task('jshint', function() {
        return (
            gulp
                .src([
                    'source/js/*.js',
                    'source/blocks/*/*.js'
                ])
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'))
        );
    });

    gulp.task('build-scripts', function() {
        return (
            gulp
                .src([
                    'bower_components/handlebars/handlebars.min.js',
                    'bower_components/lodash/dist/lodash.min.js',
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/baron/baron.min.js',
                    'bower_components/rader/rader.min.js',
                    'source/js/*.js',
                    'temp/templates.js'
                ])
                .pipe(concat('makeup.js'))
                .pipe(headerfooter.header(header))
                .pipe(headerfooter.footer(footer))
                .pipe(buildOptions.release ? uglify() : gutil.noop())
                .pipe(gulp.dest('dist/'))
        );
    });

    return function(callback) {
        runSequence('jshint', 'build-scripts', callback);
    };
};