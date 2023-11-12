const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68se.mongodb.net/?retryWrites=true&w=majority`;// ` this is use to daynamic somthig `

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// crud 

// get  
// post 
// put 
// delete


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // here we making database collection 
        const menuCollection = client.db("uiuEateryDb").collection("menu");

        const webReviewCollection = client.db("uiuEateryDb").collection("webReviews");

        // this is for all menu 
        // find use for get all product 
        // findOne to take one product 
        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result); // use to send respons to client site  
        })
        
        // this is for all web site review
        app.get('/webReviews', async (req, res) => {
            const result = await webReviewCollection.find().toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB! this is from uiu Rest server ");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('UIU restaurent is open  ')
})

app.listen(port, () => {
    console.log(`UIU rest is running Port ${port}`);
})