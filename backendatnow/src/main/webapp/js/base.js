'use strict';

/** atnow global namespace*/
var atnow = atnow || {};

atnow.index = atnow.index || {};

/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
atnow.index.CLIENT_ID =
    '198305524363-uok2plt9l263jk87at0m5dcherk6f3pr.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
atnow.index.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
atnow.index.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
atnow.index.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      atnow.index.signedIn = true;
      document.getElementById('signinButton').innerHTML = 'Sign out';
      /*document.getElementById('authedGreeting').disabled = false;*/
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
atnow.index.signin = function(mode, callback) {
  gapi.auth.authorize({client_id: atnow.index.CLIENT_ID,
      scope: atnow.index.SCOPES, immediate: mode},
      callback);
};

/**
 * Presents the user with the authorization popup.
 */
atnow.index.auth = function() {
  if (!atnow.index.signedIn) {
    atnow.index.signin(false,
        atnow.index.userAuthed);
  } else {
    atnow.index.signedIn = false;
    document.getElementById('signinButton').innerHTML = 'Sign in';
    document.getElementById('authedGreeting').disabled = true;
  }
};


/**
 * Greets the current user via the API.
 */
atnow.index.authedGreeting = function(id) {
  gapi.client.helloworld.greetings.authed().execute(
      function(resp) {
        atnow.index.print(resp);
      });
};

/**
 * Enables the button callbacks in the UI.
 */
atnow.index.enableButtons = function() {
  document.getElementById('signinButton').onclick = function() {
    atnow.index.auth();
  }
};

/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
atnow.index.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      atnow.index.enableButtons();
      atnow.index.signin(true,
          atnow.index.userAuthed);
      console.log('loading Angular')
      var $injector = angular.bootstrap(document, ['atnowApp']);
      console.log('Angular loaded');
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('atnow', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};
