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

    // implement protractor's waitForAngular()
    // browser.waitForSPA = function (callback) {
    //   var deferred = Q.defer();
    //   var i = 0;
    //   var checkDataloadedOnTimeout = function () {
    //     browser
    //       .execute('return angular.element(document.body).injector().get("$rootScope").__dataloaded;\n')
    //       .then(function (dataloaded) {
    //         if (dataloaded) {
    //           callback();
    //           deferred.resolve(browser);
    //         } else {
    //           i++;
    //           console.log('j20infra not loaded');
    //           console.log('retrying: ' + i);
    //           setTimeout(function () {
    //             checkDataloadedOnTimeout();
    //           }, 610);
    //         }
    //       });
    //   };
    //   checkDataloadedOnTimeout();
    //   return deferred.promise;
    //   return deferred.promise;
    // };

    describe('Prepare environment', function () {

      after(function() {
        browser
          .quit();
      });

      if (!appEnv) {
        // SET UP THE ENVIRONMENT FOR DESKTOP TESTS
        before(function (done) {
          return browser
            .init(desired)
            .get('http://localhost:8080/test-e2e/' + moduleName + '/')
            .nodeify(done);
            // .then(function () {
            //   // DO NOT START UNTIL YOUR SINGLE PAGE APP IS READY
            //   browser.waitForSPA(done);
            // });
        });
      } else {
        // SET UP THE ENVIRONMENT FOR IOS TESTS
        before(function (done) {
          return browser
            // THE SLEEP CALL BELOW IS NEEDED FOR RUNNING MULTIPLE SUBSEQUENT IOS TESTS
            // APPIUM CAN ONLY HANDLE ONE SESSION, SO WE NEED TO PROVIDE ENOUGH TIME FOR APPIUM
            // TO CLOSE THE PREVIOUS SESSION
            .sleep(6765)
            .init(desired)
            .sleep(4181)
            // .acceptAlert()
            // SWITCH CONTEXT TO UIWEBVIEW (FRONT END) TO DO THE ACTUAL TEST
            .contexts(function (err, items) {
              if (err) {
                // throw err;
                done(new Error(err));
              }
              // THE IF / ELSE BLOCK BELOW IS USED TO RECURRENTLY CHECK IF WEBVIEW IS AVAILABLE
              if (items.indexOf('WEBVIEW_1') > -1) {
                return browser.context('WEBVIEW_1')
                .nodeify(done);
                // return browser.context('WEBVIEW_1', function () {
                //   // DO NOT START UNTIL YOUR SINGLE PAGE APP IS READY
                //   return browser.waitForSPA(done);
                // });
              } else {
                var i = 1;
                var checkAgain = function () {
                  console.log('WEBVIEW_1 was not found, please wait');
                  setTimeout(function () {
                    return browser.contexts(function (err, contexts) {
                      if (err) {
                        done(new Error(err));
                      }
                      console.log('retry' + i);
                      console.log('Available contexts:');
                      console.log(contexts);
                      if (i > 2 && contexts.indexOf('WEBVIEW_1') > -1) {
                        return browser
                          .context('WEBVIEW_1')
                          .nodeify(done);
                        // return browser.context('WEBVIEW_1', function () {
                        //   // DO NOT START UNTIL YOUR SINGLE PAGE APP IS READY
                        //   return browser.waitForSPA(done);
                        // });
                      } else {
                        i++;
                        checkAgain();
                      }

                    });
                  }, 2584);
                };
                checkAgain();
              }
            });
        });
      }

      // RUN THE ACTUAL FRONTEND MODULE TESTS!
      callback(browser);

    });

  });

};
