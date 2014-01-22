'use strict';

var index = require('./controllers');
var usersController = require('./controllers/usersController');
var session = require('./controllers/session');
var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function (app) {
    // Server API Routes
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