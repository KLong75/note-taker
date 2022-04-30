const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
let db = require('./db/db.json');
const uniqid = require('uniqid');
const { parse } = require('path');
const { query } = require('express');

const PORT = process.env.PORT || 3001;

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
    console.log(db);

    fs.writeFile('./db/db.json', JSON.stringify(db), () => {
        res.send(req.body);
    });
});

app.delete('/api/notes/:id', (req, res) => {
  const deleteNoteId = req.params.id;
      
// remove selected note from db
      const filterList = db.filter(item => item.id !== deleteNoteId);
      console.log(filterList);
      db = filterList;
        
      fs.writeFile('./db/db.json', JSON.stringify(filterList), () => {
        res.send(req.body);
      });
});

// catch route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
    console.log("Server is now running")
});