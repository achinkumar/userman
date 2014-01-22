'use strict';
var userDao = require('../dao/userDao');
var passport = require('passport');
var mailer = require('./notificationsController');

/**
 * Create user
 */
exports.create = function (req, res, next) {

    var newUser = req.body;
    userDao.createUser(newUser, function (err, createdUser) {
        if (err) {
            // Manually provide our own message for 'unique' validation errors, can't do it from schema
            if (err.errors.email.type === 'Value is not unique.') {
                err.errors.email.type = 'The specified email address is already in use.';
            }
            return res.json(400, err);
        }
        
        // TODO :: send activation email
        // TODO :: set status as inactive
        // TODO :: establish mechanism to keep this user as inactive unless activated
        mailer.sendNotification({}, null);

        req.logIn(newUser, function (err, loggedinUser) {
            if (err) {
                return res.json({
                    'err': err
                });
            }

            return res.json(req.user.userInfo);
        });
    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    userDao.findUserById(userId, function (err, user) {
        if (err) {
            res.send({
                'err': err,
                'detailed message': 'Failed to load User'
            });
        } else {
            res.send(404, 'USER_NOT_FOUND');
        }
        res.send({
            profile: user.profile
        });
    });
};

/**
 * Change password
 */
exports.changePassword = function (req, res) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    userDao.findUserById(userId, function (err, foundUser) {

        if (userDao.authenticatePassword(oldPass, foundUser.hashedPassword, foundUser.salt)) {
            foundUser.password = newPass;

            // update after changed password
            userDao.updateUserById(foundUser._id, foundUser, function (err, noOfUserUpdated) {
                if (err) {
                    res.send(500, err);
                } else {
                    // TODO :: send an email to user to confirm password
                    // TODO :: log out user and accept new password to login
                    res.send(200);
                }
            });
        } else {
            res.send(400);
        }
    });
};

/**
 * Get current user
 */
exports.me = function (req, res) {
    res.json(req.user || null);
};