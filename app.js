require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8082;
const path = require('path');
const UserRoute = require('./Route/userRoute');
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.412ks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST, PUT ,DELETE ,PATCH'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,authorization');
    next();
});

app.get('/', (req, res) => {
    res.status(200).send(`<h4>Welcome to Testing AuthAPI testing</h4>`);
});
require('./Route/index')(app);

mongoose.connect(url, {
    useNewUrlParser: true,
});
let db = mongoose.connection;
db.on('error', function(err) {
    console.error('connection error:', err);
});

app.listen(port, (err) => {
    if (err) {
        console.log('something error in server', err);
        return;
    }
    console.log(`server running on port no ${port}`);
});