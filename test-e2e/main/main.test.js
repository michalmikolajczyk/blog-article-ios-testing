'use strict';

require('../initialize-environment.js')('/app', function (browser) {

  describe('first test', function () {

    it('should print A title', function () {
      return browser
        .elementByCss('.page-title')
        .text().should.eventually.equal('A title');
    });

  });

});
