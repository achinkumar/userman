'use strict';

var config = require('../config/env/development'),
    //    User = require('User'),
    userDao = require('../models/userDao'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
module.exports = function () {
    passport.serializeUser(function (user, done) {
        console.log(JSON.stringify(user));
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        userDao.findUserById(
            id, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
                done(err, user);
            });
    });

    // add other strategies for more authentication flexibility
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password' // this is the virtual field on the model
        },
        function (email, password, done) {
            console.log('userDao' + JSON.stringify(userDao));
            userDao.findUser({
                email: email
            }, function (err, user) {
                if (err) return done(err);

                if (!user) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
                return done(null, user);
            });
        }
    ));
};