var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:80800/my_database';

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log(`Возникла ошибка: ${err}`)
  } else {
    console.log(`Соединение установлено с ${url}`);

    contact_1 = { '_id': 1, 'fname': 'Aziz', 'sname': 'Kerimov', 'phone': '+7 929 594 40 67' };
    contact_2 = { '_id': 2, 'fname': 'Anton', 'sname': 'Dimitriev', 'phone': '+7 917 591 13 90' };
    contact_3 = { '_id': 3, 'fname': 'Alexey', 'sname': 'Ponomarev', 'phone': '+7 917 231 00 80' };
    contact_4 = { '_id': 4, 'fname': 'Valentina', 'sname': 'Ponomareva', 'phone': '+7 927 498 50 01' };
    contact_5 = { '_id': 5, 'fname': 'Max', 'sname': 'Belyaev', 'phone': '+7 967 085 52 43' };
    contact_6 = { '_id': 6, 'fname': 'Regina', 'phone': '+7 962 574 23 45' };

    function makeCollection(name, mass) {
      return new Promise((resolve, reject) => {
        var collection = db.collection(name);
        collection.insert(mass);

        resolve(collection);
      })
    }

    function newContact(collection, contact) {
      return new Promise((resolve, reject) => {
        collection.insert(contact);
        console.log(`${contact.fname} успешно добавлен в телефонную книгу`)

        resolve(collection);
      })
    }

    function updatePhBook(collection, who, what) {
      return new Promise((resolve, reject) => {
        collection.update(who, { $set: what });
        console.log('Обновление контакта успешно завершено')

        resolve(collection);
      })
    }

    function removeContact(collection, who) {
      return new Promise((resolve, reject) => {
        var contact = collection.find(who);
        collection.remove(who);
        console.log(`Контакт ${contact} успешно удален`)


        resolve(collection);
      })
    }

    function consolePhBook(collection) {
      return new Promise((resolve, reject) => {
        collection.forEach(el => {
          console.log(`Имя: ${el.fname} телефон: ${el.phone}`)
        })

        resolve(collection)
      })
    }

    function findContact(collection, who) {
      return new Promise((resolve, reject) => {
        var contact = collection.find(who) ? collection.find(who) : undefined;
        if (contact !== undefined) {
          console.log('Контакт успешно найден');
        } else {
          console.log('Контакт не найден');
        }
        resolve(contact);
      })
    }

    makeCollection('Phonebook', [contact_1, contact_2, contact_3, contact_4,
        contact_5, contact_6
      ])
      .then(consolePhBook)
      .then(collection => newContact(collection, { '_id': 7, 'fname': 'Ildar', 'sname': 'Gateev', 'phone': '+7 963 125 75 58' }))
      .then(collection => updatePhBook(collection, { 'fname': 'Alexey' }, { 'phone': '+7 960 081 07 93' }))
      .then(collection => removeContact(collection, { 'fname': 'Regina' }))
      .then(consolePhBook)
      .then(findContact({ 'sname': 'Ponomarev' }))
      .then(consolePhBook);



  }
  db.close();
})