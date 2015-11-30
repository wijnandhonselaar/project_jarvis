module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [ 'Gruntfile.js', 'public/components/*.js', 'public/components/**/*module.js', 'public/components/**/*.js' ],
            options: {
                globals: {
                    "angular": true,
                    "document": true,
                    "io": true
                }
            }
        },

        html2js: {
            options: {
                base: 'public',
                module: 'templatecache'
            },
            dist: {
                src: ['public/components/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },

        concat: {
            dist: {
                options: {
                    separator: ';'
                },
                src: [
                    'public/bower_components/jquery/dist/jquery.js',
                    'public/bower_components/angular/angular.js',
                    'public/bower_components/angularjs-slider/dist/rzslider.min.js',
                    'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'public/bower_components/Materialize/dist/js/materialize.js',
                    'public/bower_components/socket.io-client/socket.io.js',
                    'public/bower_components/keyboard/dist/js/jquery.keyboard.min.js',
                    'public/bower_components/swiper/dist/js/swiper.jquery.min.js',

                    'tmp/templates.js',

                    'public/components/**/*module.js',
                    'public/components/**/*.js',
                    'public/components/modules.js',
                    'public/components/app.js'
                ],
                dest: 'public/js/dist.js'
            },
            css: {
                options: {
                    separator: '\n'
                },
                src: [
                    'public/bower_components/Materialize/dist/css/materialize.css',
                    'public/bower_components/angularjs-slider/dist/rzslider.min.css',
                    'public/bower_components/keyboard/dist/css/keyboard-dark.min.css',
                    'public/bower_components/swiper/dist/css/swiper.min.css',
                    'public/bower_components/angularjs-slider/dist/rzslider.min.css',
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
                tasks: [ 'jshint', 'html2js:dist', 'concat:dist', 'concat:css'],
                options: {
                    atBegin: true,
                    livereload: 5050
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("development", "watch:dev");
    grunt.registerTask("minify", "uglify");
};