// Karma configuration
// Generated on Tue Jan 19 2016 13:58:07 GMT-0500 (Eastern Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        "https://www.parsecdn.com/js/parse-latest.js",
        './public/js/ThirdParty/jquery-2.1.4.min.js',
        './public/js/ThirdParty/angular.js',
        './public/js/ThirdParty/angular-ui-router.js',
        './public/js/ThirdParty/angular-animate.js',
        './public/js/ThirdParty/ui-bootstrap-tpls-0.14.3.js',
        './public/js/ThirdParty/smart-table.js',
        './public/js/atnowApp.js',
        './public/js/controllers/taskTableController.js',
        './public/js/controllers/mainFeedController.js',
        './public/js/controllers/userEditFormController.js',
        './public/js/controllers/userDetailController.js',
        './public/js/controllers/taskModalController.js',
        './public/js/controllers/taskFormController.js',
        './public/js/controllers/taskController.js',
        './public/js/controllers/navBarController.js',
        './public/js/controllers/loginController.js',
        './public/js/config.js',
        './public/js/run.js',
        './public/js/factories.js',
        './public/js/controllers/taskFeedModalController.js',
        './public/js/ThirdParty/angular-mocks.js',
        './test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox', 'Safari'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
