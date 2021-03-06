/*
   Global before() and after() launcher for Sails application
   to run tests like Controller and Models test
*/
var fs = require('fs');

var sails;
var err;

before(function(done) {
  // remove the database directories
  if (fs.existsSync('./.tmp/disk.db')) {
    fs.unlinkSync('./.tmp/disk.db');
  }

  // Lift Sails and store the app reference
  require('sails').lift({

    // turn down the log level so we can view the test results
    log: {
      level: 'error'
    },
    adapters: {
      'default': 'disk'
    }

  }, function(e, s) {
      sails = s;
      err = e;
      // export properties for upcoming tests with supertest.js
      sails.localAppURL = localAppURL = ( sails.usingSSL ? 'https' : 'http' ) + '://' + sails.config.host + ':' + sails.config.port + '';
      // save reference for teardown function
      done(err);
    });

});

// After Function
after(function(done) {
  console.log('\nLowering sails');
  sails.lower(done);
});
