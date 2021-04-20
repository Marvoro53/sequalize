//
// Server Setup
//
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = 3000;
//Start Server 
app.listen(PORT, () => console.log(`notes-app listening on port ${PORT}`));
//
// Database Setup
//
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  // host: 'local host',
  dialect: 'sqlite',
  storage: './database.sqlite'
});
//authenticate database
//.then and .catch are callbacks that listen for errors
// if or else 
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
//setup model for mapping
const Note= sequelize.define('notes', {
  note: Sequelize.TEXT, 
  tag: Sequelize.STRING,
  name: Sequelize.STRING, 
  
}); 
  //Create Notes 
  //.sync is adding all the defined models to the database
  //'force flag' if a table exsist already, it will drop it and create a new one. 
  sequelize.sync({ force: true })
  .then(()=> {
    console.log(`Database and tables have been created`)
    
    Note.bulkCreate([
      { note: 'Go to class on Thursday', tag: 'education', name: 'Marvin Lara'},
      { note: 'Listen to WACHA', tag: 'music', name: 'Khea'},
      { note: 'Go to work', tag: 'life', name: 'The Home Depot'},
      { note: 'Watch Godxilla vs Kong', tag: 'entertainment', name: "Marvin Lara"}
    ]).then(function() {
      return Note.findAll();
    }).then(function(notes) {
      console.log(notes);
    });
  });
//routes
app.get('/', (req,res) => res.send('This is your Notes App'));
//read all
app.get('/notes', function (req,res) {
    Note.findAll().then(notes => res.json(notes));
});
//
//read where
app.get('/notes/:id', function(req,res){
    Note.findAll({ where: {id: req.params.id} }).then(notes => res.json(notes));
});
//
//read or
app.get('notes/search', function(req,res){
    Note.findAll({ where: {tag: {[op.or]: [].concat(req.query.tag) }}
}).then(notes => res.json(notes));
});
//
//read limit
app.get('/notes/search', function(req,res){
    Note.find({
        limit: 2,
        where: {
            tag: {
                [Op.or]: [].concat(req.query.tag)
            }
        }
    }).than(notes => res.json(notes));
});
//inserting entities
//POST method
//body parser
app.post('/notes', function(req,res){
    Note.create({ note: req.body.note, tag: req.body.tag, name: req.body.name }).then(function(note){
        res.json(note);
    });
});
//updating entity
//.update allows changes on existing entity
//.findByPK() method
app.put('/notes/:id', function(req,res){
    Note.findByPK(req.params.id).then(function(note){
        note.update({
            note: req.body.note,
            tag: req.body.tag
        }).then((note) => {
            res.json(note);
        })
    })
})
//
//delete
app.delete('/notes/:id', function(req, res) {
    Note.findByPk(req.params.id).then(function(note) {
      note.destroy();
    }).then((note) => {
      res.sendStatus(200);
    });
  });
//
