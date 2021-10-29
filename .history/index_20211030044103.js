const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://nomad:KvsucjwlJpgIa1EH@cluster0.upabr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        console.log('hitting db');
        const database = client.db('zazabor-travels');
        const packageCollection = database.collection('packages');
        const bookingCollection = database.collection('bookings');
        console.log(packageCollection);

        // get api 
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            console.log(packages);
            console.log('hiiting all packages');
            res.send(packages);
        });

        // get single item 
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packageCollection.findOne(query);
            res.send(package);
        });

        //post api
        app.post('/addPackage', async (req, res) => {
            const package = req.body;
            console.log(package);
            const result = await packageCollection.insertOne(package);
            res.json(result);
        });

        //update pending status
        app.put('/updatePending', async (req, res) => {

            const id = req.query.id;
            console.log(req.query);
            console.log("id:" + id)
            const filter = { _id: ObjectId(id) };
            console.log("filter: " + filter)
            const updateDoc = {
                $set: {
                    pending: false
                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        })

        // get bookings api 
        app.get('/bookings', async (req, res) => {
            console.log(req.query.email);
            if (req.query.email) {
                const email = req.query.email;

                const cursor = bookingCollection.find({ userMail: email });
                const bookings = await cursor.toArray();

                console.log('hiiting all bookings');
                res.send(bookings);
            }
            else {

                const cursor = bookingCollection.find({});
                const bookings = await cursor.toArray();

                console.log('hiiting all bookings');
                res.send(bookings);
            }

        });


        // post a booking api 
        app.post('/bookings', async (req, res) => {

            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        });

        // delete api 
        app.delete('/bookings', async (req, res) => {

            const id = req.query.id;
            const query = { _id: ObjectId(id) };
            console.log("id: " + id);
            console.log("query: " + query);
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('ghurte jacchi..');
});

app.listen(port, () => {
    console.log("Running server on port " + port);
});