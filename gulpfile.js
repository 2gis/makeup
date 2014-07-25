var gulp = require('gulp'),

    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    handlebars = require('gulp-handlebars'),
    defineModule = require('gulp-define-module'),
    declare = require('gulp-declare'),
    plumber = require('gulp-plumber'), // @TODO
    
    es = require('event-stream'),
    runSequence = require('run-sequence'),

    args = require('yargs').argv;


var config = require('./config.js'),

    defaultConfig = {
        port: 3000,
        root: 'dist/'
    };


var buildOptions = {
        release: 'r' in args || 'release' in args
    };


gulp.task('default', function() {
    return gulp.start('dev');
});


gulp.task('dev', ['build'], function(callback) {
    return runSequence('build', 'connect', 'watch', callback);
});

gulp.task('watch', function(callback) {
    gulp.watch('./source/blocks/**/*.less', ['build-css']);
    gulp.watch('./source/less/**/*.less', ['build-css']);

    gulp.watch('./source/blocks/**/*.js', ['build-js']);
    gulp.watch('./source/js/**/*.js', ['build-js']);

    gulp.watch('./source/images/**/*.{jpg,jpeg,gif,png}', ['build-img']);
    gulp.watch('./source/svg/**/*.svg', ['build-img']);
});

gulp.task('build', function(callback) {
    return runSequence('build-templates', 'build-js', 'build-img', 'build-css', callback);
});


gulp.task('clean', function() {
    return gulp.src(['dist/*', 'temp/*'], { read: false }).pipe(clean());
});


gulp.task('connect', function() {
    connect.server({
        root: config.root || defaultConfig.root,
        port: config.port || defaultConfig.port
    });
});


gulp.task('build-templates', function() {
    return (
        gulp.src('source/templates/*.html')
            .pipe(handlebars())
            .pipe(defineModule('plain'))
            .pipe(declare({
                namespace: 'makeupTemplates'
            }))
            .pipe(concat('templates.js'))
            .pipe(gulp.dest('temp/'))
    );
});

gulp.task('build-js', function() {
    return (
        gulp.src(['source/js/main.js',
                  'source/blocks/*/*.js'])
            .pipe(concat('makeup.js'))
            .pipe(buildOptions.release ? uglify() : gutil.noop())
            .pipe(gulp.dest('dist/'))
    );
});

gulp.task('build-img', function() {
    return (
        gulp.src(['source/images/**/*.{jpg,jpeg,gif,png,svg}',
                  '!source/images/**/_*'])
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images/'))
    );
});

gulp.task('build-css', function() {
    return (
        gulp.src(['source/less/reset.less',
                  'source/less/mixins.less',
                  'source/less/common.less',
                  'source/blocks/*/*.less'])
            .pipe(concat('makeup.css'))
            .pipe(less())
            .pipe(buildOptions.release ? csso() : gutil.noop())
            .pipe(gulp.dest('dist/'))
    );
});
