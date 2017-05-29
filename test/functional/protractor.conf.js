var path = require('path'),
    Q = require('q'),
    fs = require('fs'),
    execSync = require('child_process').execSync;


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
      } else {
        console.log('Found WD session ', result);
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
      './steps/*.js'
    ],
    format: 'json:output/functional/test.json'
  },

  specs: [
    'suites/**/*.feature'
  ],

  baseUrl: 'http://localhost:8000',

  // Make arguments accessible from within our step definitions
  params: {
    screens: 'compare',
    plat: 'ios'
  },

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
    platformVersion: '10.3',
    deviceName: 'iPhone 6',
    automationName: 'XCUITest'
  },

  onPrepare: function () {
    var wd = require('wd');
    var protractor = require('protractor');
    var wdBridge = require('wd-bridge')(protractor, wd);

    console.log('Creating output directory');
    execSync('mkdir -p ' + path.join(__dirname, '../../output/functional'));

    console.log('Looking for app at ' + path.join(__dirname, '../../platforms/ios/build/emulator/MyApp.app'));
    fs.readdirSync(path.join(__dirname, '../../platforms/ios/build/emulator')).forEach(file => {
      console.log(file);
    });

    wdBridge.initFromProtractor(exports.config);
    return waitForWDSession();

  }
};
