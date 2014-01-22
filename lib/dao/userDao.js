'use strict';

var config = require('../config/env/development');
var crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'],
    SALT_WORK_FACTOR = 10;

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */

function makeSalt() {

    return crypto.randomBytes(16).toString('base64');
}

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */

function encryptPassword(salt, password) {
    if (!password || !salt) {
        return '';
    }
    var salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

// modify json to encrypt received plain text password to encrypted hashed password before saving

function preSaveUser(userData) {
    setPassword(userData);
    validateEmail(userData);
    validatePassword(userData);
}

// modify json to return additional needed information before returning

function postQueryUser(userDataArr) {
    // iterate and modify each item
    // 

    for (var i = 0; i < userDataArr.length; i++) {

        userDataArr[i]['userInfo'] = {
            'name': userDataArr[i].name,
            'role': userDataArr[i].role,
            'provider': userDataArr[i].provider
        };
        ////        userDataArr[i]['Profile'] = {
        ////            'name'
        //            
        //        }
    }
}

/**
 * Create User logic
 */
exports.createUser = function (userData, callback) {
    preSaveUser(userData);
    config.dbc.collection('User').insert(userData, callback)
};

/**
 * Update User logic
 */
exports.updateUser = function (findUserData, userData, callback) {
    preSaveUser(userData);
    config.dbc.collection('User').update(findUserData, userData, callback);
};

/**
 * Update User By Id logic
 */
exports.updateUserById = function (findUserId, userData, callback) {
    preSaveUser(userData);
    config.dbc.collection('User').updateById(findUserId, userData, callback);
};


/**
 * Get User logic by query
 */
exports.findUser = function (queryData, callback) {
    config.dbc.collection('User').find(queryData).toArray(function (err, res) {
        postQueryUser(res);
        callback(err, res);
    })

};

exports.findUserById = function (userId, callback) {
    config.dbc.collection('User').findById(userId, function (err, res) {
        // postQueryUser(res);
        callback(err, res);
    })
};

//encrypts password and sets it to userData's hashed password    

function setPassword(userData) {
    var salt = makeSalt();
    userData['salt'] = salt;
    //    userData['hashedPassword'] = encryptPassword(salt, userData.password);//TODO uncomment this and remove below line
    userData['hashedPassword'] = userData.password;
    delete userData['password'];

};


// Validate empty email

function validateEmail(userData) {
    if (authTypes.indexOf(userData.provider) !== -1) {
        return true;
    } else {
        return false;

    }


};

// Validate empty password

function validatePassword(userData) {
    if (authTypes.indexOf(userData.provider) !== -1) {
        return true;
    } else {
        return false;

    }
};

//function for authenticating password
exports.authenticatePassword = function authenticatePassword(password, hashedPassword, salt) {
    //    return encryptPassword(password, salt) === hashedPassword;//TODO uncomment this and remove below line
    return password === hashedPassword;
};