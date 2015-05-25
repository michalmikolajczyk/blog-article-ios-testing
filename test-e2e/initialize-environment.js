'use strict';

module.exports = function (moduleName, callback) {

  var wd = require('wd');
  var chai = require('chai');
  var chaiAsPromised = require('chai-as-promised');

  chai.use(chaiAsPromised);
  chai.should();
  chaiAsPromised.transferPromiseness = wd.transferPromiseness;

  var appEnv;
  var browser;
  var desired;
  var port;


  // USING THE _IOSTEST VARIABLE TO SWITCH BETWEEN IOS AND DESKTOP
  if (process && process.env && process.env._JUNE20IOSTEST && process.env._JUNE20IOSTEST !== '0') {
    // ENVIRONMENT CONFIGURATION VARIABLES FOR IOS TESTS
    appEnv = true;
    desired = {
      // "appium-version": "1.0",
      platformName: 'iOS',
      platformVersion: '8.3',
      deviceName: '=iPad Air',
      app: 'http://localhost:8080/path/to/your-app.zip',
      browserName: 'App Name'
    };
    port = 4723;
  } else {
    // ENVIRONMENT CONFIGURATION VARIABLES FOR DESKTOP TESTS
    appEnv = false;
    desired = {
      browserName: 'chrome',
      version: '',
      platform: 'ANY'
    };
    port = 4444;
  }

  describe('Initiate tests', function () {
    
    // the timeout below is by official example.
    // setting up the environment for the iOS tests takes time.
    this.timeout(514229);
    browser = wd.promiseChainRemote('0.0.0.0', port);

    describe('Prepare environment', function () {

      after(function() {
        browser
          .quit();
      });

      if (!appEnv) {
        // SET UP THE ENVIRONMENT FOR DESKTOP TESTS
        before(function () {
          return browser
            .init(desired)
            .get('http://localhost:8080' + moduleName + '/');
        });
      } else {
        // SET UP THE ENVIRONMENT FOR IOS TESTS
        before(function () {
          return browser
            .init(desired)
            .contexts(function (err, items) {
              if (err) {
                throw err();
              }
              var webviewIndex = items.indexOf('WEBVIEW_1');
              return browser.context(webviewIndex);
            });
        });
      }

      // RUN THE ACTUAL FRONTEND MODULE TEST
      // USING SEPARATE MODULE TESTS!
      callback(browser);

    });

  });

};
