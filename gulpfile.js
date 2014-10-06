var gulp = require('gulp'),
    args = require('yargs').argv,
    connect = require('gulp-connect');
    runSequence = require('run-sequence'),
    mocha = require('gulp-mocha'),
    config = require('./config.js');

var buildOptions = {
        release: 'r' in args || 'release' in args
    };


gulp.task('default', function() {
    return gulp.start('dev');
});


gulp.task('d', ['dev']);
gulp.task('dev', function(callback) {
    return runSequence('build', 'connect', 'watch', callback);
});


gulp.task('build', function(callback) {
    return runSequence('templates', 'js', 'sprite', 'css', callback);
});


gulp.task('t', ['jshint', 'unit']);
gulp.task('test', ['unit']);


gulp.task('watch', function(callback) {
    // Templates
    gulp.watch('./source/templates/*.html', ['templates', 'js']);

    // Scripts
    gulp.watch('./source/blocks/**/*.js', ['js']);
    gulp.watch('./source/js/**/*.js', ['js']);
    gulp.watch('./source/jsPartials/**/*.js', ['js']);

    // Images
    gulp.watch('./source/images/**/*.{jpg,jpeg,gif,png}', ['img']);
    gulp.watch('./source/svg/**/*.svg', ['sprite', 'css']);

    // Styles
    gulp.watch('./source/blocks/**/*.less', ['css']);
    gulp.watch('./source/less/**/*.less', ['css']);
});


gulp.task('connect', function() {
    connect.server({
        root: __dirname + '/' + config.root,
        port: config.port
    });
});


gulp.task('templates', require('./tasks/templates')(buildOptions));
gulp.task('js', require('./tasks/scripts')(buildOptions));
gulp.task('img', require('./tasks/images')(buildOptions));
gulp.task('sprite', require('./tasks/sprite')(buildOptions));
gulp.task('css', require('./tasks/styles')(buildOptions));
gulp.task('css', require('./tasks/styles')(buildOptions));
gulp.task('test', require('./tasks/tests')(buildOptions));
