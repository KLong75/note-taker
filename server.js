const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uniqid = require('uniqid');

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get('/api/notes', (req, res) => {
    res.json(db)
});

app.post('/api/notes', (req, res) => {
    req.body.id = uniqid();
    console.log(req.body);
    console.log(db);
    db.push(req.body);
    console.log(db)

    fs.writeFile('./db/db.json', JSON.stringify(db), () => {
        res.send(req.body);
    });

});

// catch route
app.get('*', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'))
});


app.listen(3001, () => {
    console.log("Server is now running")
});