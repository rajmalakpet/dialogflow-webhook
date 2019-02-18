var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/webhook', (req, res) => {
    console.log('/webhook got hit with req: ')
    if (!req.body) return res.sendStatus(400)
    res.setHeader('Content-Type', 'application/json')
    console.log('received the data: ', req.body);
    let response = 'raj malakpet worked';
    let responseObj = {
        "fulfillmentText": response,
        "fulfillmentMessages": [{"text":{"text":[" Worked "]}}],
        "source": ""
    }
    console.log(responseObj)
    return res.json(responseObj)
})

app.listen(port, () => {
    console.log('app is running on port: ', port);
})