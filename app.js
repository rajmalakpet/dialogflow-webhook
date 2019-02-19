var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
require('dotenv').config()
var bodyParser = require('body-parser')
var TokenCache = require('google-oauth-jwt').TokenCache,
tokens = new TokenCache();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/getToken", (req, res, next) => {
    console.log('<=== /getToken was hit ===>');
    new Promise((resolve) => {
            tokens.get({
                // use the email address of the service account, as seen in the API console
                email: process.env.email,
                // use the PEM file we generated from the downloaded key
                key: (process.env.NODE_ENV == "production") ? JSON.parse(process.env.key) : process.env.key,
                // specify the scopes you wish to access
                scopes: ['https://www.googleapis.com/auth/cloud-platform']
            },
            (err, token) => {
                console.log('<=== check error and token: '+err+', '+token);
                if(typeof(token) !== "undefined" && token !== null){
                    res.json({"token": token});
                }else if(err){
                    res.json({"token": "error"});
                }else{
                    res.json({"token": "error"});
                }
                resolve(token);
            }
        );
    });
});

app.listen(port, () => {
    console.log('app is running on port: ', port);
})