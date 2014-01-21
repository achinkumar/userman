'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    usersController = require('./controllers/usersController'),
    session = require('./controllers/session');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.get('/api/awesomeThings', api.awesomeThings);
  
  app.post('/api/users', usersController.create);
  app.put('/api/users', usersController.changePassword);
  app.get('/api/users/me', usersController.me);
  app.get('/api/users/:id', usersController.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};