var webpackConfig = require('./webpack.test.js');

module.exports = function(config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [{
      pattern: './karma-test-shim.js',
      watched: true
    }],

    preprocessors: {
      './karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },

    reporters: ['kjhtml', 'dots', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: [ 'html', 'text-summary' ],
      fixWebpackSourcePaths: true,
      dir: 'output/coverage',
      thresholds: {
        global: { // thresholds for all files
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80
        },
        each: { // thresholds per file
          statements: 50,
          lines: 50,
          branches: 50,
          functions: 50
        }
      }
    },


    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  };

  config.set(_config);
};
