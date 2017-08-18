// Karma configuration
// Generated on Tue Jul 12 2016 11:27:37 GMT-0700 (PDT)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'app/.www/components/app.js',
            'app/.www/components/**/*.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/.www/components/**/*.view.html',
            'app/components/**/*.unit-test.js'
        ],


        // list of files to exclude
        exclude: [
            'app/components/**/*.e2e-test.js',
            'app/node_modules/angular-*/angular-*.min.js',
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/components/**/*.unit-test.js' : ['browserify'],
            'app/.www/components/**/*.html': ['ng-html2js']
        },

        browserify: {
            debug: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'html'],

        htmlReporter: {
            outputFile: 'tests/www/reports/karma.html'
        },

        // web server port
        port: 3100,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}