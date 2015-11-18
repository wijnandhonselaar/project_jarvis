module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                options: {
                    separator: ';'
                },
                src: [
                    'public/bower_components/angular/angular.js',
                    'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'public/bower_components/jquery/dist/jquery.js',
                    'public/bower_components/Materialize/dist/js/materialize.js',
                    'public/bower_components/socket.io-client/socket.io.js',

                    'public/components/**/*module.js',
                    'public/components/**/*.js',
                    'public/components/modules.js',
                    'public/components/app.js'
                ],
                dest: 'public/js/dist.js'
            },
            css: {
                options: {
                    separator: ';'
                },
                src: [
                    'public/bower_components/Materialize/dist/css/materialize.css',

                    'public/css/app.css'
                ],
                dest: 'public/css/dist.css'
            }
        },

        uglify: {
            dist: {
                files: {
                    'public/js/dist.js': [ 'public/js/dist.js' ]

                },
                options: {
                    mangle: true
                }
            }
        },

        watch: {
            dev: {
                files: [
                    'public/index.html',
                    'Gruntfile.js',
                    'public/components/app.js',
                    'public/components/**/*.js',
                    'public/components/**/*.html',
                    'public/components/modules.js',
                    'public/css/app.css'
                ],
                tasks: ['concat:dist', 'concat:css'],
                options: {
                    atBegin: true,
                    livereload: 5050
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("development", "watch:dev");
};