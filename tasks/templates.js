var gulp = require('gulp');
var wrap = require('gulp-wrap');
var precompile = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var minify = require('html-minifier').minify;
var runSequence = require('run-sequence');
var path = require('path');

module.exports = function(buildOptions) {
    gulp.task('templates.build', function() {
        return (
            gulp
                .src(['source/templates/*.hbs'])
                .pipe(precompile())
                .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
                    imports: {
                        processPartialName: function(fileName) {
                            return '"' + path.basename(fileName, '.js') + '"';
                        }
                    }
                }))
                .pipe(concat('partials.js'))
                .pipe(gulp.dest('temp/'))
        );
    });

    return function(callback) {
        runSequence('templates.build', callback);
    };
};
