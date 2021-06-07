const express = require('express');

const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

const fs = require('fs');
const path = require('path');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));

app.get('/api/notes', (req, res) => {
    //fs.readFile
    //const notes = require('./db/db.json');
    fs.readFile("./db/db.json", "UTF8", function(err, data){
        const notes = JSON.parse(data);
        res.json(notes);
    });
  });
  
  app.post('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "UTF8", function(err, data){
        const notes = JSON.parse(data);

        const note = req.body;
        note.id = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

        notes.push(note);
        fs.writeFile('./db/db.json',JSON.stringify(notes), function(err){
            if(err) throw err
            res.json(notes);
        });
    });
  });

  app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "UTF8", function(err, data){
        const notes = JSON.parse(data);

        const updatedNotes = notes.filter(note => note.id != req.params.id);

        fs.writeFile('./db/db.json',JSON.stringify(updatedNotes), function(err){
            if(err) throw err
            res.json({message: "note deleted"});
        });
    });
  });

  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });