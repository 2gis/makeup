var gulp = require('gulp'),
    handlebars = require('gulp-handlebars'),
    defineModule = require('gulp-define-module'),
    declare = require('gulp-declare'),
    concat = require('gulp-concat'),
    minify = require('html-minifier').minify,
    runSequence = require('run-sequence');

module.exports = function(buildOptions) {
    gulp.task('build-templates', function() {
        return (
            gulp
                .src('source/templates/*.html')
                .pipe(handlebars())
                .pipe(defineModule('plain'))
                .pipe(declare({
                    namespace: 'makeupTemplates',
                    processContent: function(content, filepath) {
                        return minify(content, {
                            removeComments: true,
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            removeEmptyAttributes: true
                        });
                    }
                }))
                .pipe(concat('templates.js'))
                .pipe(gulp.dest('temp/'))
        );
    });

    return function(callback) {
        runSequence('build-templates', callback);
    };
};