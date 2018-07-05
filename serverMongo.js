const express = require('express')
const app = express()
const mongodb = require('mongodb')
const cors = require('cors')
const bodyParser = require('body-parser')

const port = process.env.PORT || 8080

const MongoClient = mongodb.MongoClient
const dbURL = "mongodb://localhost:27017"

app.use(cors())
app.use(bodyParser.json())

MongoClient.connect(dbURL, (err, client) => {

    if (err)
        console.log("Unable to connect DB. Error: " + err)
    else {
        console.log("Connected to DB")

    let db = client.db("VidboardDB");
    let loginMaster = db.collection('loginMaster');
    let JpProfile = db.collection('JpProfile');
    let JpDashboard = db.collection('JpDashboard');
    let JpInbox = db.collection('JpInbox');

        app.post("/loginData", (req, res) => {
            let query = req.body;
            console.log("query : " + JSON.stringify(query));
            loginMaster.find(query).toArray((err, loginData) => {
                if (err)
                    throw(err)
                console.log("loginData : " + JSON.stringify(loginData));
                res.end(JSON.stringify(loginData))
            })
            res.writeHead(200, {"Content-Type": "text/json"})
        })

        app.post("/doSignUp", (req, res) => {

            let email = req.body.email;
            let findQuery = {email: email};
            let insertQuery = req.body;

            loginMaster.find(findQuery).toArray((err, loginData) => {
                if (err)
                    throw(err)
//                console.log("loginData : " + JSON.stringify(loginData))
//                console.log("loginData.length " + loginData.length);        
                if (loginData !== null && loginData.length > 0) {
                    res.writeHead(200, {"Content-Type": "text/json"})
                    res.end(JSON.stringify({"msg": "Already Registered"}))
                } else {
                    loginMaster.insert(insertQuery, (err, records) => {
                        if (err)
                            throw(err)
                    })
                    res.writeHead(200, {"Content-Type": "text/json"})
                    res.end(JSON.stringify({"msg": "Registeration Success"}))
                }
            })


        })

        app.post("/doSignIn", (req, res) => {
            let query = req.body;
//            console.log("query : " + JSON.stringify(query));
            loginMaster.find(query).toArray((err, loginData) => {
                if (err)
                    throw(err)
                console.log(loginData);
            })
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({"msg": "success"}))
        })

        app.post("/JpProfile", (req, res) => {
            let insertQuery = req.body;
            let whereQuery = {email: req.body.email};
            let newValues = {$set: {status: "Post Job"}};
//            console.log("query : " + JSON.stringify(query));
            JpProfile.insert(insertQuery, (err, records) => {
                if (err)
                    throw(err)

                loginMaster.updateOne(whereQuery, newValues, (err, res) => {
                    if (err)
                        throw(err)
                })
            })
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({"msg": "Profile Setup Success"}))
        })

        app.post("/AddJobPost", (req, res) => {
            let insertQuery = req.body;
            let whereQuery = {email: req.body.email};
            let newValues = {$set: {status: "Dashboard"}};
//            console.log("query : " + JSON.stringify(query));
            JpDashboard.insert(insertQuery, (err, records) => {
                if (err)
                    throw(err)

                loginMaster.updateOne(whereQuery, newValues, (err, res) => {
                    if (err)
                        throw(err)
                })
            })
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({"msg": "Job Posted Successfully"}))
        })

        app.post("/JpDashboard", (req, res) => {
            let query = req.body;
//            console.log("query : " + JSON.stringify(query));
            JpDashboard.find(query).toArray((err, result) => {
                if (err)
                    throw(err)
                console.log(result);
                res.writeHead(200, {"Content-Type": "text/json"})
                res.end(JSON.stringify(result))
            })
        })
        
        app.post("/JpInbox", (req, res) => {
            let query = req.body;
//            console.log("query : " + JSON.stringify(query));
            JpInbox.find(query).toArray((err, result) => {
                if (err)
                    throw(err)
                console.log(result);
                res.writeHead(200, {"Content-Type": "text/json"})
                res.end(JSON.stringify(result))
            })
        })
    }

    app.on('close', () => {
        console.log('CLOSING SERVER')
    })
})

app.listen(port, () => {
    console.log("DB server started at 8080")
})