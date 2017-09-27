var mongodb = require('mongodb');
var express = require('express');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:80800/my_database';

const app = express();
app.listen(1337);

const restV1 = express.Router();

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(`Возникла ошибка: ${err}`)
  } else {
    console.log(`Соединение установлено с ${url}`);

    contact_1 = {'fname': 'Aziz', 'sname': 'Kerimov', 'phone': '+7 929 594 40 67' };
    contact_2 = {'fname': 'Anton', 'sname': 'Dimitriev', 'phone': '+7 917 591 13 90' };
    contact_3 = {'fname': 'Alexey', 'sname': 'Ponomarev', 'phone': '+7 917 231 00 80' };
    contact_4 = {'fname': 'Valentina', 'sname': 'Ponomareva', 'phone': '+7 927 498 50 01' };
    contact_5 = {'fname': 'Max', 'sname': 'Belyaev', 'phone': '+7 967 085 52 43' };
    contact_6 = {'fname': 'Regina', 'phone': '+7 962 574 23 45' };

    const mass = [
      contact_1, contact_2, contact_3, contact_4, contact_5, contact_6
    ]

    restV1.get('/:name', (req, res) => {
      var collection = db.collection(req.params.name);
      collection.insert(mass);

      res.json(collection);
      res.sendStatus(200);
    });

    restV1.get('/', (req, res) => {
      res.json(collection);
      res.sendStatus(200);
    });

    restV1.post('/new/:fname/sname/:sname/phone/:phone', (req, res) => {
      if(req.params.fname && req.params.sname && req.params.phone) {
        const new_contact = {
          'fname': req.params.fname, 'sname': req.params.sname, 'phone': req.params.phone
        }
        collection.insert(new_contact);

        res.json(collection);
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    restV1.put('/update/:who/att/:att/vul/:vul', (req, res) => {
      if(req.params.who && req.params.att && req.params.vul) {
        collection.update({ 'fname' : req.params.who }, { '$set': { req.params.att : req.params.vul } });

        res.json(collection);
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }

    });
    
    restV1.delete('/remove/:name', (req, res) => {
      if (req.params.name) {
        collection.remove({ 'fname' : req.params.name });

        res.json(collection);
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    restV1.get('/find/:name', (req, res) => {
      if(req.params.name && collection.find({ 'fname' : req.params.name })) {
        res.json(collection.find({ 'fname' : req.params.name }));
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
  }
  db.close();
})

app.use('/api/v1', restV1);