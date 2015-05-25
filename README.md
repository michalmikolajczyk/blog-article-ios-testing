# ios-testing

This is the codebase for the article at http://michalmikolajczyk.com/end-to-end-testing-hybrid-apps/

intended for use with the article

## setup

In the root directory, run

```
npm install -g gulp
npm install -g mocha
npm install -g appium
npm install -g protractor
npm install -g http-server
npm install
```

wrap up a server
```
http-server
```

## run the tests

run the tests
```
gulp test-e2e
gulp test-ios
```
