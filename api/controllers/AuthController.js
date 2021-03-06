/**
 * AuthController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling authentication requests.
 */
var passport = require('passport');

/* Authenticate a user based on the credentials returned,
 * whether those are provided by 'local' user/password
 * logins or by OAuth authentication + REST profile from
 * remote server.
 */
function authenticate(req, res, strategy) {
  if (req.user) {
    passport.authorize(strategy, function(err, user, info)
    {
      res.redirect('/profile/edit');
    })(req, res);
  } else {
    passport.authenticate(strategy, function(err, user, info)
    {
      if ((err) || (!user))
      {
        sails.log.debug('Authentication Error:', err, info);
        res.redirect('/auth');
        return;
      }

      req.logIn(user, function(err)
      {
        if (err)
        {
          sails.log.debug('Authentication Error:', err, info);
          res.redirect('/auth');
          return;
        }

        res.redirect('/projects');
        return;
      });
    })(req, res);
  }
};

/* Process any OAuth based authentication.
 * Handles the initial redirect, and then the callback.
 */
function processOAuth(req, res, strategy, options) {
  if (req.params['id'] === 'callback') {
    // Authenticate, log in, and create the user if necessary
    authenticate(req, res, strategy);
  } else {
    // start the oauth process by redirecting to the service provider
    passport.authenticate(strategy, options)(req, res);
  }
}

module.exports = {
  /* View login options
   */
  index: function(req, res) {
    // if the user is logged in, redirect them back to the app
    if (req.user) { res.redirect('/'); return; }
    res.view();
  },

  /* Authentication Providers
  */
  local: function(req, res) {
    authenticate(req, res, 'local');
  },
  oauth2: function(req, res) {
    processOAuth(req, res, 'oauth2');
  },
  myusa: function(req, res) {
    processOAuth(req, res, 'myusa', {scope: 'profile'});
  },
  linkedin: function(req, res) {
    processOAuth(req, res, 'linkedin', {scope: ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network']});
  },

  /* Logout user from session
   */
  logout: function (req,res) {
    // logout and redirect back to the app
    req.logout();
    res.redirect('/projects');
  }

};
