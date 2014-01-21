'use strict';
var config = require('./env/development');
//var userDao = require('../../models/userDao');
//console.log('>>>>>>>>>>>>>>> '+JSON.stringify(config));
/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
//config.dbc.collection('Thing').remove({},function() {
//  config.dbc.collection('Thing').insert([{
//    name : 'HTML5 Boilerplate',
//    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
//    awesomeness: 10
//  }, {
//    name : 'AngularJS',
//    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
//    awesomeness: 10
//  }, {
//    name : 'Karma',
//    info : 'Spectacular Test Runner for JavaScript.',
//    awesomeness: 10
//  }, {
//    name : 'Express',
//    info : 'Flexible and minimalist web application framework for node.js.',
//    awesomeness: 10
//  }, {
//    name : 'MongoDB + Mongoose',
//    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
//    awesomeness: 10
//  }], function(err,res) {
//      console.log('finished populating things');
//    }
//  );
//});                                                                                                                                                                                                                                 

// Clear old users, then add a default user
config.dbc.collection('User').remove({},function() {
  config.dbc.collection('User').insert([{
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }], function(err,res) {
      console.log('finished populating users');
    }
  );
});
