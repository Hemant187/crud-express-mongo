const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const path = require('path')

const uri = "mongodb+srv://username:password@cluster0.ksrpxaq.mongodb.net/?retryWrites=true&w=majority";

// Make sure you place body-parser before your CRUD handlers!

MongoClient.connect(uri).then(
    client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')

        const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
        app.use(express.static('public'))
        app.use(bodyParser.json())

        app.use(bodyParser.urlencoded({ extended: true }))

        app.get('/', (req, res) => {
            db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(err => console.log(err))
        })
        app.use(express.static(path.join(__dirname, 'public')));

        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate({ name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote,
                    },
                },
                {
                    upsert: true,
                })
                .then(result => {
                    console.log(result)
                    res.json('Success')
                })
                .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            // Handle delete event here
            quotesCollection
    .deleteOne({ name: req.body.name })
    .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
      })
        .catch(error => console.error(error))
        })

        app.listen(8000, () => console.log('Express runs!'))
    }
)
    .catch(error => console.error(error))