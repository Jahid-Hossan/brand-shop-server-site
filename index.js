const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shpjug3.mongodb.net/?retryWrites=true&w=majority`;

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

        const productCollection = client.db("productsDB").collection("products");
        const cartCollection = client.db("productsDB").collection("cart");
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await productCollection.findOne(query);
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product)
            const result = await productCollection.insertOne(product);
            res.send(result)
        })


        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const newData = req.body;
            // console.log(req.params.id)
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateData = {
                $set: {
                    image: newData.image,
                    name: newData.name,
                    brand: newData.brand,
                    category: newData.category,
                    price: newData.price,
                    description: newData.description,
                    rating: newData.rating,
                }
            }
            const result = await productCollection.updateOne(filter, updateData, option);
            res.send(result)

            //     console.log(newData.image,
            //         newData.name,
            //         newData.brand,
            //         newData.category,
            //         newData.price,
            //         newData.description,
            //         newData.rating,)
        })


        // cart section

        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/cart', async (req, res) => {
            const product = req.body;
            // console.log(product)
            const result = await cartCollection.insertOne(product);
            res.send(result)
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            // const product = req.body;
            // console.log(product)
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Tech shop server is running')
})

app.listen(port, () => {
    console.log(`Tech and electronics server is running on port ${port}`)
})