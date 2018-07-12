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

module.exports = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.status(401).end();
    }

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).end();
        }

        const userId = decoded.sub;

        let query = 'SELECT * FROM LOGIN_MASTER WHERE ID = $1 ';
        let param = [userId];

        return client.query(query, param, (err, result) => {
            if (err || result.rows.length === 0) {
                return res.status(401).end();
            }
            console.log('Query Executed! User authentication from auth-check middleware')
            return next();
        })

    });

};
