const jwt = require('jsonwebtoken');
const {Client} = require('pg')
const config = require('../db-config');

var dbURI
if(process.env.node_env === 'production'){
    dbURI = process.env.DATABASE_URL
}
else{
    dbURI = config.dbUri
}

const client = new Client({
    connectionString: dbURI
})
client.connect()

const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {

    let query = 'SELECT * FROM LOGIN_MASTER WHERE EMAIL = $1 AND PASSWORD = MD5($2)';
    let param = [email.trim(), password.trim()];

    client.query(query, param, (err, result) => {
        if (err) {
            return done(err);
        } else {
            console.log('Query Executed For Log In !')
        }
        if (result.rows.length > 0) {

            const payload = {
                sub: result.rows[0].id
            };

            const token = jwt.sign(payload, config.jwtSecret);
            const data = {
                name: result.rows[0].email                
            };

            return done(null, token, data);

        } else {
            console.log("Error set for sign in");
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';

            return done(error);
        }
    })

});
