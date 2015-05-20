var fs = require('fs');
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');

module.exports = function(buildOptions) {
    var HOOKS = 'tasks/pre-push.sh';
    var PRE_PUSH = '.git/hooks/pre-push';

    function copy(src, dest, mode) {
        mode = mode || 0755;

        return fs.createReadStream(src)
            .pipe(fs.createWriteStream(dest, {
                mode: mode
            }));
    }

    function install(cb) {
        copy(HOOKS, PRE_PUSH)
            .on('finish', cb.bind(this, null));
    }

    gulp.task('hooks.install', install);
    gulp.task('hooks', install); // alias

    gulp.task('hooks.clear', function(cb) {
        rimraf(PRE_PUSH, cb);
    });

    gulp.task('hooks.run', ['jshint', 'unit']);
};
