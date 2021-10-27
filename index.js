const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;
// middleware
app.use(cors());
app.use(express.json());

//user:mydbuser2
//pass: b9GE3twcoBsrbWkH

const uri = "mongodb+srv://mydbuser2:b9GE3twcoBsrbWkH@cluster0.qimng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("students");
        const userCollection = database.collection("information");
        // Get Api
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //Post Api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('Added user', result)
            console.log('Hitting the post', req.body);
            // res.send('POST request to the homepage');
            res.json(result)
        })
        //find
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await userCollection.findOne(query)
            console.log('load user with id:', id)
            res.send(user)
        })

        //update Api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            console.log('updated user', req)
            res.json(result)
        })

        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            console.log("dleting user with id", result);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my CRUD Servers")
});
app.listen(port, () => {
    console.log("Running Server on Port", port);
})