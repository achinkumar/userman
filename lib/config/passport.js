'use strict';

var config = require('../config/env/development');
var userDao = require('../dao/userDao');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Passport configuration
 */
module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user[0]._id);
    });
    passport.deserializeUser(function (id, done) {
        userDao.findUserById(
            id, function (err, res) { // don't ever give out the password or salt
                done(err, res);
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
            }, function (err, foundUserArr) {
                if (err) return done(err);

                if (!foundUserArr || foundUserArr.length === 0) {
                    return done(null, false, {
                        message: 'This email is not registered.'
                    });
                }
                if (!userDao.authenticatePassword(password, foundUserArr[0].hashedPassword, foundUserArr[0].salt)) {
                    return done(null, false, {
                        message: 'This password is not correct.'
                    });
                }
                return done(null, foundUserArr);
            });
        }
    ));
};