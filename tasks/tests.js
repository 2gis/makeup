var gulp = require('gulp');
var mocha = require('gulp-mocha');

module.exports = function(buildOptions) {
    gulp.task('unit', function() {

        var opts = {
            globals: ['DEBUG', 'jQuery'],
            reporter: 'dot'
        };

        return gulp.src([
            'tasks/unit.config.js',
            'source/**/*.spec.js'
        ], {read: false})
            .pipe(mocha(opts))
            .on('error', function() {
                gulp.emit('tl.fail', 'Unit tests failed!');
            });
    });
};
