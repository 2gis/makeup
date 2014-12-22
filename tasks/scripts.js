var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    headerfooter = require('gulp-headerfooter'),
    uglify = require('gulp-uglify')
    runSequence = require('run-sequence'),
    fs = require('fs'),
    _ = require('lodash');

module.exports = function(buildOptions) {
    var header = fs.readFileSync('./source/jsPartials/header.js');
    var footer = fs.readFileSync('./source/jsPartials/footer.js');


    gulp.task('jshint', function() {
        return (
            gulp
                .src(_.compact([
                    'source/js/*.js',
                    'source/blocks/*/*.js'
                ]))
                .pipe(jshint())
                .pipe(jshint.reporter('jshint-stylish'))
        );
    });

    gulp.task('build-scripts', function() {
        return (
            gulp
                .src(_.compact([
                    'node_modules/handlebars/dist/handlebars.min.js',
                    'node_modules/lodash/dist/lodash.min.js',
                    buildOptions.noJquery ? null : 'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/baron/baron.min.js',
                    'node_modules/rader/rader.min.js',
                    'source/js/*.js',
                    'temp/templates.js'
                ]))
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