var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var headerfooter = require('gulp-headerfooter');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var fs = require('fs');
var _ = require('lodash');

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

    gulp.task('copy-scripts', function() {
        return (
            gulp
                .src('node_modules/handlebars/dist/handlebars.js')
                .pipe(gulp.dest('dist/'))
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
        runSequence('jshint', 'build-scripts', 'copy-scripts', callback);
    };
};