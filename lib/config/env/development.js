'use strict';

module.exports = {
    env: 'development',
    mongo: {
        uri: 'mongodb://localhost/fullstack-dev'
    },
    // Connect to database
    dbc : require('mongoskin').db(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost:27017/paycart', {
        safe: true
    })
};