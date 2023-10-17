const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://jahidhossen02:E5RTMmPrC2AF97kb@cluster0.shpjug3.mongodb.net/?retryWrites=true&w=majority";

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
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product)
            const result = await productCollection.insertOne(product);
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