module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        clean: {
            regular: ['dist/*', 'temp/*']
        },

        concat: {
            less: {
                src: [
                    'source/less/reset.less',
                    'source/less/mixins.less',
                    'source/less/common.less',
                    'source/blocks/*/*.less'
                ],
                dest: 'temp/makeup.less'
            },
            js: {
                src: [
                    'source/js/main.js',
                    'source/blocks/*/*.js'
                ],
                dest: 'dist/makeup.js',
            }
        },

        uglify: {
            application: {
                files: {
                    'dist/makeup.js': ['dist/makeup.js']
                }
            }
        },

        less: {
            application: {
                files: {
                    'dist/makeup.css': ['temp/makeup.less']
                }
            }
        },

        csso: {
            application: {
                files: {
                    'dist/makeup.css': ['dist/makeup.css']
                }
            }
        },

        copy: {
            images: {
                expand: true,
                src: [
                    'source/images/**/*.{jpg,jpeg,gif,png}',
                    '!source/images/**/_*'
                ],
                dest: 'dist/images/',
                rename: function(destBase, destPath) {
                    destPath = destPath.replace('source/images/', '');
                    return destBase + destPath;
                }
            },
            svg: {
                expand: true,
                src: [
                    'source/svg/**/*.svg',
                    '!source/svg/_*'
                ],
                dest: 'dist/svg/',
                rename: function(destBase, destPath) {
                    destPath = destPath.replace('source/svg/', '');
                    return destBase + destPath;
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: [
                'source/blocks/**/*.js',
                'source/js/*.js',
                'gruntfile.js'
            ]
        },

        dataUri: {
            svg: {
                src: ['dist/makeup.css'],
                dest: 'dist/',
                options: {
                    target: ['**/*.svg'],
                    fixDirLevel: true,
                    baseDir: 'dist/'
                },
                rename: function(destBase, destPath) {
                    destPath = destPath.replace('dist/', '');
                    return destBase + destPath;
                }
            }
        },

        watch: {
            css: {
                files: [
                    'source/blocks/**/*.less',
                    'source/less/**/*.less'
                ],
                tasks: ['css'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },
            js: {
                files: [
                    'source/blocks/**/*.js',
                    'source/js/**/*.js'
                ],
                tasks: ['js'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            },
            images: {
                files: [
                    'source/images/**/*.{jpg,jpeg,gif,png}',
                    'source/svg/*.svg'
                ],
                tasks: ['img'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },

        svgmin: {
            options: {},
            dist: {
                files: [{
                    expand: true,
                    src: [
                        'source/svg/*.svg',
                        'source/svg/*/*.svg',
                        '!source/svg/_*'
                    ],
                    dest: 'dist/svg/',
                    rename: function(destBase, destPath) {
                        destPath = destPath.replace('source/svg/', '');
                        return destBase + destPath;
                    }
                }]
            }
        },

        connect: {
            server: {
                options: {
                    port: 3000,
                    base: 'dist/'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-csso');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-compile-handlebars');
    grunt.loadNpmTasks('grunt-data-uri');

    // Tasks

    grunt.registerTask('img', "Build images", function() {
        var tasks;

        if (grunt.option('release')) {
            tasks = ['copy:images', 'svgmin'];
        } else {
            tasks = ['copy:images', 'copy:svg'];
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('css', "Build styles", function() {
        var tasks = ['concat:less', 'less'];

        if (grunt.option('release')) {
            tasks.push('csso', 'dataUri');
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('js', "Build scripts", function() {
        var tasks = ['concat:js'];

        if (grunt.option('release')) {
            tasks.push('uglify');
        }
        grunt.task.run(tasks);
    });

    grunt.registerTask('default', [
        'clean:regular',
        'img',
        'css',
        'js'
    ]);

    grunt.registerTask('dev', [
        'default',
        'connect',
        'watch'
    ]);

};
