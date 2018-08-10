const express = require('express')
const app = express()
const {Client} = require('pg')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./server/db-config');

const fs = require('fs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_SERVICE_EMAIL,
        pass: process.env.MAIL_SERVICE_PASS
    }
});
//console.log("process.env : \n",process.env);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;
const serverName = host;
//const serverName = host+':'+port;

app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

let dbURI
let ssl

//if(process.env.node_env === 'production'){
    dbURI = process.env.DATABASE_URL
    ssl = process.env.DATABASE_SSL
    console.log(" dbURI : ",dbURI);
//}
//else{
//    dbURI = config.dbUri
//    ssl = false
//    console.log("local dbURI : ",dbURI);
//}

const client = new Client({
    connectionString: dbURI,
    ssl: ssl,
});

client.connect();

/*
 passport local signup and signin strategy.
 */
const localSignupStrategy = require('./server/strategies/localSignupStrategy')
const localSigninStrategy = require('./server/strategies/localSigninStrategy')

app.use(passport.initialize())
passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localSigninStrategy)

//const authCheck = require('./server/auth-check-middleware/auth-check')
//app.use('/api', authCheck)

const apiRoute = require('./server/server-route/api')
const authRoute = require('./server/server-route/auth')
app.use('/api', apiRoute)
app.use('/auth', authRoute)

/*
 Business Logic
 */

/* Job Poster Routers ----------------------------------------------------------*/

app.post("/JpProfileSetup", (req, res) => {

    let query = 'INSERT INTO JP_PROFILE \n\
                    (EMAIL,NAME,INDIVIDUAL,COMPANY,LOOKING_FOR) \n\
                    VALUES ($1,$2,$3,$4,$5)';
    let param = [req.body.email, req.body.name, req.body.individual, req.body.company, req.body.preference]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "Profile Setup Fail"}))
            return false;
        }
        console.log('Query Executed JpProfileSetup !');

        query = 'UPDATE LOGIN_MASTER SET STATUS = $2 \n\
                    WHERE EMAIL = $1 ';
        param = [req.body.email, req.body.status]
        client.query(query, param, (err, result) => {
            console.log(err ? err.stack : 'Query Executed for Status Update!')
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Profile Setup Success"}))
        })

    })

})

app.post("/JpProfile", (req, res) => {

    let query = 'SELECT * FROM JP_PROFILE \n\
                    WHERE EMAIL = $1 ';
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Job Post Profile Fail"}))
            return false;
        }
        console.log('Query Executed for Job Posts Profile!')
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: result.rows[0]}))
    })

})

app.post("/AddJobPost", (req, res) => {

    let query = 'INSERT INTO JOB_POSTS \n\
                    (EMAIL,TITLE,DESCRIPTION,SKILLS,MIN_BUDGET,MAX_BUDGET\n\
                        ,EQUIPMENT,ACCOMODATION,PREFER_LOCAL,REGION) \n\
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
    let param = [req.body.email, req.body.title, req.body.description, req.body.skills, req.body.budgetMin, req.body.budgetMax
                , req.body.equipment, req.body.accommodation, req.body.preferLocal, req.body.region]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "Job Post Fail"}))
            return false;
        }
        console.log('Query Executed AddJobPost !');

        query = 'UPDATE LOGIN_MASTER SET STATUS = $2 \n\
                    WHERE EMAIL = $1 ';
        param = [req.body.email, req.body.status]
        client.query(query, param, (err, result) => {
            console.log(err ? err.stack : 'Query Executed for Status Update!')
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Job Post Success"}))
        })

    })

})

app.post("/JpDashboard", (req, res) => {

    let query = 'SELECT * FROM JOB_POSTS \n\
                    WHERE EMAIL = $1 ';
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Job Post Data Fail"}))
            return false;
        }
        console.log('Query Executed for Job Posts!')
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: result.rows}))
    })
})

app.post("/JpInbox", (req, res) => {
    console.log('req.body.email : ' + req.body.email);
    let query = '';

    query += 'SELECT X.JOB_POST_ID, X.TITLE, JSON_AGG(X.*) INTERESTED_FL FROM ( ';
    query += 'SELECT JOB_INTEREST.ID,JOB_POSTS.ID JOB_POST_ID,JOB_POSTS.TITLE,FL_PROFILE.EMAIL \n\
                    ,FL_PROFILE.SKILLS,FL_PROFILE.WORK,JOB_INTEREST.MESSAGE,JOB_INTEREST.STATUS \n\
                FROM JOB_INTEREST \n\
                INNER JOIN JOB_POSTS ON JOB_POSTS.ID = JOB_INTEREST.JOB_POST_ID \n\
                INNER JOIN FL_PROFILE ON FL_PROFILE.EMAIL = JOB_INTEREST.FL_EMAIL \n\
                WHERE JOB_INTEREST.JP_EMAIL = $1';
    query += ' ) X GROUP BY X.JOB_POST_ID,X.TITLE ';
//    console.log(query);
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Job Post Inbox Fail"}))
            return false;
        }
        console.log('Query Executed for Job Posts Inbox!')
        console.log(result.rows);

        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: result.rows}))
    })
})

app.post("/showJpInterest", (req, res) => {

    let query = 'UPDATE JOB_INTEREST SET STATUS = $2 \n\
                    WHERE ID = $1 ';
    let param = [req.body.job_interest_id, req.body.status]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "Job Post Interest Fail"}))
            return false;
        }
        console.log('Query Executed for Status Update!')
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: "Job Post Interest Success"}))
    })

})

app.get("/FlReview/:email/:review", (req, res) => {

//    console.log('req.param.email : '+req.params.email);
//    console.log('req.param.review : '+req.params.review);

    let query = 'UPDATE FL_PROFILE \n\
                    SET REVIEW = $2 \n\
                    WHERE EMAIL = $1 ';
    let param = [req.params.email, req.params.review];

    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/html"})
            res.end(new Buffer('<p>There is some issue</p>'))
            return false;
        }
        console.log('Query Executed Review Updated !');

        query = 'UPDATE LOGIN_MASTER SET STATUS = $2 \n\
                    WHERE EMAIL = $1 ';
        param = [req.params.email, 'Dashboard']
        client.query(query, param, (err, result) => {
            if (err) {
                console.log(err.stack);
                res.writeHead(500, {"Content-Type": "text/html"})
                res.end(new Buffer('<p>There is some issue</p>'))
                return false;
            }
            console.log('Query Executed for Status Update!')
            res.writeHead(200, {"Content-Type": "text/html"})
            res.end(new Buffer('<h1 align="center">You Have Successfully ' + req.params.review + ' "' + req.params.email + '" </h1>'))
        })
    })
})

/* Freelancer Routers ---------------------------------------------------------- */

app.post("/doFlSignIn", (req, res) => {

    let query = 'SELECT * FROM LOGIN_MASTER WHERE EMAIL = $1 ';
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        console.log(err ? err.stack : 'Query Executed!')
        console.log("result.rows.length : " + result.rows.length);
        console.log(result.rows[0]);
        if (result.rows.length > 0 && result.rows[0].user_type == 'Freelancer') {
            console.log("just return status : " + result.rows[0].status);
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: result.rows[0].status}))
        } else if (result.rows.length > 0 && result.rows[0].user_type == 'Job Poster') {
            res.writeHead(401, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: 'You are a Job Poster.'}))
        } else {
            let query = 'INSERT INTO LOGIN_MASTER \n\
                            (EMAIL,PASSWORD,USER_TYPE,MODE,STATUS)\n\
                            VALUES ($1,MD5($2),$3,$4,$5)';
            let param = [req.body.email, req.body.password, req.body.user_type, req.body.mode, req.body.status]
            client.query(query, param, (err, result) => {
                console.log(err ? err.stack : 'Query Executed for Registration in doFlSignIn!')
                res.writeHead(200, {"Content-Type": "text/json"})
                res.end(JSON.stringify({success: true, message: "Registeration Success"}))
            })
        }
    })
})

app.post("/FlProfileSetup", (req, res) => {

    let query = 'INSERT INTO FL_PROFILE (EMAIL,NAME,LOCATION,TRAVEL,VIDEO,REVIEW,RESUME,SKILLS,WORK) \n\
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)';
    let param = [req.body.email, req.body.name, req.body.location, req.body.travel, req.body.video
                , req.body.review, req.body.resume, req.body.skills, req.body.work]
    client.query(query, param, (err, result) => {

        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "Profile setup Fail"}))
            return false;
        }
        console.log("Query Executed for FlProfileSetup ");

        query = 'UPDATE LOGIN_MASTER SET STATUS = $2 \n\
                    WHERE EMAIL = $1 ';
        param = [req.body.email, req.body.status]
        client.query(query, param, (err, result) => {
            if (err) {
                console.log(err.stack);
            }
            console.log('Query Executed for Status Update!')
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Profile Update Success"}))
        })

    })

//    let FILE_CONTENT = result.rows[0].resume;
    let FILE_CONTENT = req.body.resume;
//    console.log(FILE_CONTENT);
    let htmlContent = '';
    htmlContent += '<h1>Hello</h1><h3>Please review the profile of ' + req.body.name + '</h3>'
    htmlContent += '<h5>Email : ' + req.body.email + '</h5>'
    htmlContent += '<p>Main location : ' + req.body.location + '</p>'
    htmlContent += '<p>Willing to travel for jobs? : ' + req.body.travel + '</p>'
    htmlContent += '<p>Video link : ' + req.body.video + '</p>'
    htmlContent += '<br><a href="http://' + serverName + '/FlReview/' + req.body.email + '/Approved"> Approve </a>';
    htmlContent += '<br><a href="http://' + serverName + '/FlReview/' + req.body.email + '/Rejected"> Reject </a>';

//    return;
    let mailOptions = {
        from: 'yash.97373@gmail.com',
        to: 'pruthvi.zandawala@gmail.com',
        subject: 'Freelancer[' + req.body.name + '] profile for review',
        html: htmlContent,
        attachments: [{
                filename: req.body.name + '_resume',
                path: FILE_CONTENT
            }]
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
//            res.writeHead(200, {"Content-Type": "text/json"})
//            res.end(JSON.stringify({success: true, message: "Profile Setup Success"}))
        }
    });

})

app.post("/FlProfile", (req, res) => {

    let query = 'SELECT * FROM FL_PROFILE \n\
                    WHERE EMAIL = $1 ';
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Job Post Profile Fail"}))
            return false;
        }
        console.log('Query Executed for Job Posts Profile!')
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: result.rows[0]}))
    })

})

app.post("/FlAddInfo", (req, res) => {

    let query = 'UPDATE FL_PROFILE \n\
                    SET SKILLS = $2, WORK = $3 \n\
                    WHERE EMAIL = $1 ';
    let param = [req.body.email, req.body.skills, req.body.work]
    client.query(query, param, (err, result) => {

        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "More info Fail"}))
            return false;
        }
        console.log('Query Executed Fl Profile Update !');

        query = 'UPDATE LOGIN_MASTER SET STATUS = $2 \n\
                WHERE EMAIL = $1 ';
        param = [req.body.email, req.body.status]
        client.query(query, param, (err, result) => {
            if (err) {
                console.log(err.stack);
            }
            console.log('Query Executed for Status Update!')
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Profile Update Success"}))
        })

    })

})

app.post("/FlDashboard", (req, res) => {

    let SEARCH_FIELD;
    let query = "SELECT * FROM JOB_POSTS ";
//    query += " LEFT JOIN JOB_INTEREST JI ON JI.JOB_POST_ID=JOB_POSTS.ID AND JI.FL_EMAIL != $1";
    if (req.body.preferLocal) {
        query += " INNER JOIN FL_PROFILE FLP ON FLP.LOCATION = JOB_POSTS.REGION ";
    }
    query += " WHERE 1=1 ";
    if (req.body.searchText != "") {
        if (req.body.searchIn == "Title") {
            SEARCH_FIELD = 'TITLE';
        } else if (req.body.searchIn == "Description") {
            SEARCH_FIELD = 'DESCRIPTION';
        } else if (req.body.searchIn == "Skills") {
            SEARCH_FIELD = 'SKILLS';
        }
        query += " AND " + SEARCH_FIELD + " ILIKE '%' || '" + req.body.searchText + "' || '%' ";
    }
    query += " AND MIN_BUDGET > " + req.body.min_budget + " AND MAX_BUDGET < " + req.body.max_budget;
    if (req.body.equipment) {
        query += " AND EQUIPMENT = " + true;
    }
    if (req.body.accommodation) {
        query += " AND ACCOMODATION = " + true;
    }
    query += " AND JOB_POSTS.ID NOT IN (SELECT JOB_POST_ID FROM JOB_INTEREST WHERE FL_EMAIL = $1)";

    console.log(query);
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "Search Post Fail"}))
            return false;
        }
//        if (result.rows.length > 0) 
        {
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: result.rows}))
        }
    })
})

app.post("/showFlInterest", (req, res) => {

    let query = 'INSERT INTO JOB_INTEREST (FL_EMAIL,JP_EMAIL,JOB_POST_ID,MESSAGE,STATUS) \n\
                    VALUES ($1,$2,$3,$4,$5)';
    let param = [req.body.fl_email, req.body.jp_email, req.body.job_post_id, req.body.message, req.body.status]
    client.query(query, param, (err, result) => {

        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: "showFlInterest Fail"}))
            return false;
        }
        console.log("Query Executed for showFlInterest ");
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: "showFlInterest Success"}))
    })
})

app.post("/FlInbox", (req, res) => {
    console.log('req.body.email ---------------INBOX-------------------- : ' + req.body.email);
    let query = '';

//    query += 'SELECT X.JOB_POST_ID, X.TITLE, JSON_AGG(X.*) INTERESTED_FL FROM ( ';    
    query += 'SELECT JOB_INTEREST.ID,JOB_POSTS.ID JOB_POST_ID,JOB_POSTS.TITLE\n\
                    ,JOB_POSTS.MIN_BUDGET, JOB_POSTS.MAX_BUDGET, FL_PROFILE.EMAIL \n\
                    ,FL_PROFILE.SKILLS,FL_PROFILE.WORK,JOB_INTEREST.MESSAGE,JOB_INTEREST.STATUS \n\
                FROM JOB_INTEREST \n\
                INNER JOIN JOB_POSTS ON JOB_POSTS.ID = JOB_INTEREST.JOB_POST_ID \n\
                INNER JOIN FL_PROFILE ON FL_PROFILE.EMAIL = JOB_INTEREST.FL_EMAIL \n\
                WHERE JOB_INTEREST.FL_EMAIL = $1';
//    query += ' ) X GROUP BY X.JOB_POST_ID,X.TITLE ';
    console.log(query);
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        if (err) {
            console.log(err.stack);
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: "Freelancer Inbox Fail"}))
            return false;
        }
        console.log('Query Executed for Freelancer Inbox!')
//        console.log(result.rows);
        res.writeHead(200, {"Content-Type": "text/json"})
        res.end(JSON.stringify({success: true, message: result.rows}))
    })
})

//Also add freelancer status 
app.post("/getLoginDetail", (req, res) => {
    let query = 'SELECT LM.EMAIL,LM.STATUS';
    if (req.body.user_type && req.body.user_type == 'Freelancer') {
        query += ' ,FL.REVIEW ';
    }
    query += ' FROM LOGIN_MASTER LM ';
    if (req.body.user_type && req.body.user_type == 'Freelancer') {
        query += ' LEFT JOIN FL_PROFILE FL ON LM.EMAIL = FL.EMAIL  ';
    }
    query += ' WHERE LM.EMAIL = $1  ';
    console.log(query);
    let param = [req.body.email]
    client.query(query, param, (err, result) => {
        console.log(err ? err.stack : 'Query Executed!')
//        console.log("result.rows.length : " + result.rows.length);
        if (result.rows.length > 0) {
            console.log(result.rows[0]);
            console.log("just return status : " + result.rows[0]);
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: result.rows[0]}))
        } else {
            console.log("Error in getLoginDetail");
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: 'Login detail not found'}))
        }
    })
})
/* ----------------------------------------------------------------------------- */

app.get("/", (req, res) => {
    console.log('Server setup successfully completed');
//    res.writeHead(200, {"Content-Type": "text/html"})
//    res.end(new Buffer('<h1>Server setup successfully completed</h1>'))
    let query = 'SELECT * FROM LOGIN_MASTER LIMIT 1';
    client.query(query, null, (err, result) => {
        console.log(err ? err.stack : 'Query Executed!')
//        console.log("result.rows.length : " + result.rows.length);
        if (result.rows.length > 0) {
            console.log("Success with DB : \n", result.rows[0]);
            res.writeHead(200, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: true, message: result.rows[0]}))
        } else {
            console.log("Error with DB");
            res.writeHead(500, {"Content-Type": "text/json"})
            res.end(JSON.stringify({success: false, message: 'Error with DB'}))
        }
    })
    
//    res.writeHead(500, {"Content-Type": "text/json"})
//    res.end(JSON.stringify({success: false, message: 'Login detail not found'}))
})

app.listen(port, () => {
    console.log("DB server started at ", port)
})

//    fs.writeFile("C:\Users\yash\Desktop\Work\fs_base64.txt", FILE_CONTENT, function (err) {
//    let path = 'C:\\Users\\yash\\Desktop\\Work\\fs_base64.txt';
//    let buffer = new Buffer(FILE_CONTENT);
//    fs.open(path, 'w', function (err, fd) {
//        if (err) {
//            throw 'error opening file: ' + err;
//        }
//
//        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
//            if (err)
//                throw 'error writing file: ' + err;
//            fs.close(fd, function () {
//                console.log('file written');
//            })
//        });
//    });