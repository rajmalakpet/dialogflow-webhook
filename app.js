var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
var bodyParser = require('body-parser')
var TokenCache = require('google-oauth-jwt').TokenCache,
tokens = new TokenCache();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get("/getToken", (req, res, next) => {
    console.log('<=== /getToken was hit: ', process.env.NODE_ENV);
    console.log('<=== check the email: ', process.env.email_id);
    console.log('<=== check the private_key: ', process.env.private_key);
    new Promise((resolve) => {
            tokens.get({
                // use the email address of the service account, as seen in the API console
                email: (process.env.NODE_ENV == "production") ? JSON.parse(process.env.email_id) : process.env.email_id,
                // use the PEM file we generated from the downloaded key
                key: (process.env.NODE_ENV == "production") ? JSON.parse(process.env.private_key) : process.env.private_key,
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