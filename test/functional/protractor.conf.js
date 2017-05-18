var path = require('path'),
    Q = require('q');


// Wait for wdBrowser to acquire a session to account for wd-bridge's bug which does not return
// a promise from initFromProtractor although it performs asynchronous handling in order to
// retrieve the current session and assign it to wdBrowser.
var waitForWDSession = function () {
  console.log('Waiting for WD session...');
  return wdBrowser.getSessionId().then(
    function (result) {
      if (result === null) {
        return Q.delay(1000).then(function () {
          return waitForWDSession();
        });
      }
    },
    function (error) {
      console.log('An error occurred while waiting for WD: ' + error);
    });
};

exports.config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  seleniumAddress: 'http://localhost:4723/wd/hub',

  cucumberOpts: {
    require: [
      './steps/base.js'
    ],
    format: 'json:output/functional/test.json'
  },

  specs: [
    'suites/**/*.feature'
  ],

  baseUrl: 'http://localhost:8000',

  capabilities: {
    browserName: '',
    autoWebview: true,
    locationServicesEnabled: false,
    autoAcceptAlerts: true,
    allScriptsTimeout: 12000,
    getPageTimeout: 10000, //how long to wait for a page to load
    resultJsonOutputFile: null,
    restartBrowserBetweenTests: false,
    app: path.join(__dirname, '../../platforms/ios/build/emulator/MyApp.app'),
    platformName: 'ios',
    platformVersion: '10.2',
    deviceName: 'iPhone 6',
    automationName: 'XCUITest'
  },

  // suites: protractorFunctionality.generateSuites(args.cust, args.pkg),

  onPrepare: function () {
    var wd = require('wd');
    var protractor = require('protractor');
    var wdBridge = require('wd-bridge')(protractor, wd);

    wdBridge.initFromProtractor(exports.config);
    return waitForWDSession();

  }
};
