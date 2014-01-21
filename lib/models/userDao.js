'use strict';

var config = require('../config/env/development'),
    crypto = require('crypto');

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
    if (!password || !salt) return '';
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
    console.log(JSON.stringify(userDataArr));
    for (var i = 0; i < userDataArr.length; i++) {

        userDataArr[i]['userInfo'] = {
            'name': userDataArr[i].name,
            'role': userDataArr[i].role,
            'provider': userDataArr[i].provider
        };

        userDataArr[i]['hashedPassword'] = encryptPassword(salt, password);
        delete userDataArr[i]['password'];
    }
}

/**
 * Create User logic
 */
exports.createUser = function (userData, callback) {
    console.log('>>>' + userData);

    preSaveUser(userData);
    config.dbc.collection('User').insert(userData, callback)
};


/**
 * Get User logic by query
 */
exports.findUser = function (queryData, callback) {
    console.log('in finduser ');
    config.dbc.collection('User').find(queryData, function (err, res) {
        postQueryUser(res);
        callback(err, res);
    })

};

exports.findUserById = function (userId, callback) {
    config.dbc.collection('User').findById(userId, function (err, res) {
        console.log('in finduser ');
//        postQueryUser(res);
        callback(err, res);
    })
};

//encrypts password and sets it to userData's hashed password    
function setPassword(userData) {
    console.log('88888' + makeSalt());
    var salt = makeSalt();
    userData['salt'] = salt;
    userData['hashedPassword'] = encryptPassword(salt, userData.password);
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
function authenticatePassword(plainText, hashedPassword) {
    return encryptPassword(plainText) === hashedPassword;
};