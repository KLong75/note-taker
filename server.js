const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
let db = require('./db/db.json');
const uniqid = require('uniqid');
const { parse } = require('path');
const { query } = require('express');
const app = express();

// refresh page on delete of note to remove deleted note from the screen
// not sure why you have to click the trash can button twice for this to work 
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload")

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
      liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLiveReload());

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
  /*
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
      //console.log(data);
      console.log(deleteNoteId);
      const noteList = JSON.parse(data);
      console.log(noteList);*/
      
// remove selected note from data
      const filterList = db.filter(item => item.id !== deleteNoteId);
      console.log(filterList);
        
      fs.writeFile('./db/db.json', JSON.stringify(filterList), () => {
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