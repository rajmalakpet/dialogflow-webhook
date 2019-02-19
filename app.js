var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
//require('dotenv').config()
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
                email: 'takeout@takeout-7e4ca.iam.gserviceaccount.com',
                // use the PEM file we generated from the downloaded key
                key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvBaTzTqGRRd3F\nSS5i3NQz3h1r7yXl7f/01lJlSKqqZ8x7HknYPRtmgYd53ATpeqmtWQiFnhtpau6/\ntBA1ebXTyGbNXbwGZK4QEhUKjt8G2GWLgb2TZY5wESwnosHs6GW/Ov60pB6sJOyw\nOrqR1GrWfNNBYjPgb6L9NYzxxHXJCCzeKwNUC3MDOxxn2QRvsnRxIcWnuldojl9h\ndXQic9aCvhwYR8A4ZN3c/j86pThqdEZEyNHU4r+ktkYRrC6mdIlCYoMqSihYCjF5\noG5Vl+uvu4epM8BaG9+4fbSGjuIx+CIUkW4094j3n66YDJbK0WMpJAGc27f7flhn\nyj8Pk0TBAgMBAAECggEAAIMlF5SFnUsQ4jxFU0/naJpbTnB+1Ub7YokM9aPIvExm\n7f5sxtut7i1aoZXa51NYnNiBMYGHSo/GY8YBuda+fFO7T+ZSdksHTEyxplKWLuGF\naysKhgk/iWhjD1Lwm58i0U3/4E47LA1eUOLV650zx1pj7jTwAMjYd3W3l2t4BBbw\n0G/Z1uVjTJYUhJ9SVk8nWMMLWZZ50rErnGf27RKGQnVxHqdDdHJE/CJMU+m3KPrQ\nuLYYokYBhTmFW++L/2qnSZQTHWsZ4SZPJUZBOzmzmE8Ys31vA9Hf7Pp+Y3Jx2qUD\ndh9l1XkBdamyIa+Z3sQ5aHqgIugj2j+/nij+vyVvGQKBgQDs9ZofkTbrKDKJwju5\n/jZUXKcSF1TPOgs/xqCh5/joH2xq82FTBuF3umGmSFifucvhNCd99qR6A944rmsP\nRFCp29pVDk+gIokfu+8H6V98kbqBQOm15SsLt/YwfrvWrEUsCa3eB4auNMrtRl/l\nL7uOVlh2pn4ijZF0q8KTRhiKqQKBgQC9FfQtqnAtztmXR/nlV+g3R8V0KdXabseU\n8XFjPqZlFdArVBlLlT0GxuraZC281FK3CZmggwHKrOZahAr+zWcpdXZ5DbYBfDeT\nR+sclPJxcEpYVVviSD9Fs5ERid2FDBkc5XnTJQODBeKKsY1Bx8zU/GNcV+tVc8vF\nMfQcXiyQWQKBgHrNXa52Z2u/TVGvY5ykbiuSSNNLXBx5DFNk8OJ3gbtqbZmPwCRz\nMG4IHYs7exJsC4kOqljRdbP2RThCzCEBWnxs/92MqR9oRoA3uUz0WRQJwgoyReyK\nc6CDGgdP5rD+XmrQKVcjt1yY54HIMvJnpl/Bx97VshDeJT+9s/z3GsjhAoGADqpU\nPPJ6LuNbNwOLG0GdLiRv6RmRj5aF/kRXsgXa6/4sHiAwsg8KI6tr7bJVZc7l93JU\nKwHeMrUETMLvA2I0/R8yKCNrGWRj/xVV4+qdfzThX0aHkN5foe1SdBTITJhqnjYi\nI8E8K35aWr14okB335EPt8rN4tvPUyUTtNuNA0kCgYEAuG3GhI0NZ/aM9lDyjcb5\nzgmaFP5Bi23AcBs8FoF5WN7EHZdZ/dIlyBoghHEYQFrLBsNWS5KjGB3u3L/MscjE\nyzHMjeeymwAK9gfqNhTJSCYzu8uVQREYwEG1iQGkWhTx0uBpLvqfNwLNoAaqaQUd\nkTp1Sf0JfRWmRQVieqMMw1Y=\n-----END PRIVATE KEY-----\n',
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