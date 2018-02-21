var mongodb = require('mongodb');
var express = require('express');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:80800/my_database';
var port = process.env.PORT || 3000

const app = express();


contact_1 = { 'fname': 'Aziz', 'sname': 'Kerimov', 'phone': '+7 929 594 40 67' };
contact_2 = { 'fname': 'Anton', 'sname': 'Dimitriev', 'phone': '+7 917 591 13 90' };
contact_3 = { 'fname': 'Alexey', 'sname': 'Ponomarev', 'phone': '+7 917 231 00 80' };
contact_4 = { 'fname': 'Valentina', 'sname': 'Ponomareva', 'phone': '+7 927 498 50 01' };
contact_5 = { 'fname': 'Max', 'sname': 'Belyaev', 'phone': '+7 967 085 52 43' };
contact_6 = { 'fname': 'Regina', 'phone': '+7 962 574 23 45' };

const mass = [
  contact_1, contact_2, contact_3, contact_4, contact_5, contact_6
];

app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
});

const restV1 = express.Router();

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(`Возникла ошибка: ${err}`)
  } else {
    console.log(`Соединение установлено с ${url}`);

    var collection = db.collection('collection');
    mass.forEach(el => {
      collection.insert(el);
    });

    restV1.get('/', (req, res) => {
      res.status(200).send(`Контакты: ${collection}`);
    });

    restV1.post('/new', (req, res) => { // /new?fname=some&sname=some&phone=some
      if (req.query) {
        const new_contact = {
          'fname': req.query.fname,
          'sname': req.query.sname,
          'phone': req.query.phone
        }
        collection.insert(new_contact);

        res.status(200).send(`Новый контакт создан: ${new_contact}`);
      } else {
        res.sendStatus(404);
      }
    });

    restV1.put('/:id/update', (req, res) => { // /update?fname=some||false&sname=some||false&phone=some||false
      if (req.query) {
        for (var key in req.query) {
          if (req.query[key] !== 'false') {
            collection.update({ _id: req.params.id }, { '$set': { 'fname': req.query[key] } });
          }
        }

        const updContact = collection.find({ _id: req.params.id });

        res.status(200).send(`Контакт обновлен: ${updContact}`);
      } else {
        res.sendStatus(404);
      }

    });

    restV1.delete('/remove', (req, res) => { // /remove?fname=name
      if (req.params.name) {
        collection.remove({ 'fname': req.query.fname });

        res.status(200).send(`Контакт удален`)
      } else {
        res.sendStatus(404);
      }
    });

    restV1.get('/find', (req, res) => { // /find?fname=some||sname=some||phone=some
      if (req.query) {
        for (var key in req.query) {
          res.status(200).send(`Контакт: ${collection.find({ key : req.query[key] })}`);
        }
      } else {
        res.sendStatus(404);
      }
    });
  }
  db.close();
})

app.use('/api/v1', restV1);