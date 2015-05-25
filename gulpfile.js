'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var shell = require('gulp-shell');
var webdriverUpdate = require('gulp-protractor').webdriver_update;

function runMochaOnWebdriver () {
  var suite = args.suite || '**';

  shell.task('webdriver-manager start &', {quiet: true})();
  // allow webdriver to start, should not take more than 4181ms
  setTimeout(function () {
    return shell.task('_IOSTEST=0 mocha test-e2e/' + suite + '/*.test.js')();
  }, 4181);
}

function runMochaOnAppium () {
  var suite = args.suite || '**';

  shell.task('appium', {quiet: true})();
  // allow appium to start, should not take more than 4181ms
  setTimeout(function () {
    return shell.task('_IOSTEST=1 mocha test-e2e/' + suite + '/*.test.js')();  
  }, 4181);
}


gulp.task('test-e2e', ['webdriver-update'], runMochaOnWebdriver);
gulp.task('test-ios', runMochaOnAppium);
gulp.task('webdriver-update', webdriverUpdate);
