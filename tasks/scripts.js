var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(buildOptions) {
    
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

    gulp.task('scripts.build', function() {
        return (
            gulp
                .src([
                    'node_modules/handlebars/dist/handlebars.min.js',
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/lodash/index.js',
                    'node_modules/baron/baron.js',
                    'node_modules/rader/rader.js',
                    'temp/partials.js',
                    'source/js/makeup.js',
                    'source/js/*.js'
                ])
                .pipe(concat('makeup.js'))
                .pipe(buildOptions.release ? uglify() : gutil.noop())
                .pipe(gulp.dest('dist/'))
        );
    });

    return function(callback) {
        runSequence('jshint', 'scripts.build', callback);
    };
};
