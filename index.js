const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.POT || 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-dczafpo-shard-00-00.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-01.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-02.ylujpzf.mongodb.net:27017/?ssl=true&replicaSet=atlas-ul1323-shard-0&authSource=admin&retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("addProductDB");
        const addProductCollection = database.collection("addProduct");

        app.post('/brandCart', async(req, res) =>{
            const newProduct = req.body;
            console.log(newProduct)
            const result = await addProductCollection.insertOne(newProduct)
            res.send(result)
        })

        app.get('/brandCart', async(req, res) =>{
            const cursor = addProductCollection.find();
            const query = await cursor.toArray();
            res.send(query)
        })

        app.get('/brandCart/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            console.log(id, query)
            const result = await addProductCollection.findOne(query)
            res.send(result)
            console.log(result)
        })

        app.put('/brandCart/:id', async(req, res) =>{
            const id = req.params.id;
            const body = req.body;
            const filter = {_id: new ObjectId(id)}
            const option = {upsert: true}
            const updateProduct = {
                $set: {
                    photo:body.photo,
                    name: body.name,
                    brandName: body.brandName,
                    price: body.price,
                    type: body.type,
                    rating: body.rating,
                    description: body.description
                }
            }
            const result = await addProductCollection.updateOne(filter, updateProduct, option)
            res.send(result)
        })

// --------------------------------------------------------------------------------
        //add to cart
        const myCartCollection = client.db("myCartDB").collection("myCart");

        app.post('/myCart', async(req, res) =>{
            const newAddToCart = req.body;
            console.log(newAddToCart)
            const result = myCartCollection.insertOne(newAddToCart)
            res.send(result);
        })

        app.get('/myCart', async(req, res) =>{
            const cursor = myCartCollection.find()
            const query = await cursor.toArray()
            res.send(query)
        })

        app.get('/myCart/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            console.log(id, query)
            const result = await myCartCollection.findOne(query)
            res.send(result)
            console.log(result)
        })

        app.delete('/myCart/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await myCartCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('MY AUTOMOTIVE BRAND SERVER RUNNING ON PORT')
})

app.listen(port, () =>{
    console.log(`My automotive brand server running on: ${port}`)
})