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
        console.log(packageCollection);
        // get api 
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            console.log(packages);
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
        app.post('/packages', async (req, res) => {

            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result);
        });

        // delete api 
        app.delete('/packages/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.deleteOne(query);
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