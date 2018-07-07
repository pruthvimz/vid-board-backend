const {Client} = require('pg')
const PassportLocalStrategy = require('passport-local').Strategy
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

module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    console.log("email : " + email);
    console.log("password : " + password);
    console.log("req.body.user_type : " + req.body.user_type);
//    console.log("req body : ");
//    console.log(req.body);
    let query = 'SELECT COUNT(*) COUNT FROM LOGIN_MASTER WHERE EMAIL = $1 ';
    let param = [email.trim()]
    client.query(query, param, (err, result) => {
        if (err) {
            return done(err)
        } else {
            console.log('Query Executed Sign Up Count !' + result.rows[0].count)
        }
        if (result.rows[0].count > 0) {
            const error = new Error('You are already a part of Vidboard.');
            error.name = 'AlreadyRegistered';
            return done(error);
        } else {
            console.log("Going to insert");
            let query = 'INSERT INTO LOGIN_MASTER\n\
                         (EMAIL,PASSWORD,USER_TYPE,MODE,STATUS)   \n\
                         VALUES ($1,MD5($2),$3,$4,$5)';
            let param = [email.trim(), password.trim(), req.body.user_type, req.body.mode, req.body.status]
            client.query(query, param, (err, result) => {
                if (err) {
                    console.log(err);
                    return done(err)
                } else {
                    console.log('Query Executed - Signed Up !')
                }
                return done(null)
            })
        }
    })

})