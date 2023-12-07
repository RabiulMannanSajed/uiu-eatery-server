const express = require("express");
const app = express();
const cors = require("cors");
//json Web token
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z68se.mongodb.net/?retryWrites=true&w=majority`; // ` this is use to daynamic somthig `

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // here we making database collection
    const usersCollection = client.db("uiuEateryDb").collection("users");
    const menuCollection = client.db("uiuEateryDb").collection("menu");
    const foodItemCollection = client.db("uiuEateryDb").collection("fooditem");
    const foodCartsCollection = client
      .db("uiuEateryDb")
      .collection("foodCarts");
    const webReviewCollection = client
      .db("uiuEateryDb")
      .collection("webReviews");

    //jwt token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "48h",
      });
      res.send({ token });
    });

    //  user related apis

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // test making admin
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // test adding rest name

    app.patch("/users/restaurantName/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          restaurantName: "khan's Kitchen",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    // this is for restaurant info
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result); // use to send response to client site
    });

    // this is  for foodItem
    app.get("/fooditem", async (req, res) => {
      const result = await foodItemCollection.find().toArray();
      res.send(result);
    });

    // this is for all web site review
    app.get("/webReviews", async (req, res) => {
      const result = await webReviewCollection.find().toArray();
      res.send(result);
    });

    //  to show that in client site  2nd
    app.get("/foodCarts", async (req, res) => {
      const email = req?.query?.email;
      console.log("email", email);
      if (!email) {
        res.send([]);
      }

      // this what
      const query = { email: email };
      const result = await foodCartsCollection.find(query).toArray();
      res.send(result);
    });
    // this is for data take from client site 1st
    app.post("/foodCarts", async (req, res) => {
      const item = req.body;
      const result = await foodCartsCollection.insertOne(item);
      res.send(result);
    });

    // delete item form  database 3rd also done
    app.delete("/foodCarts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCartsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB! this is from uiu Rest server "
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("UIU restaurent is open  ");
});

app.listen(port, () => {
  console.log(`UIU rest is running Port ${port}`);
});
