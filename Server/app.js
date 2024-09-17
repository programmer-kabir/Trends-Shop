const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

//
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://tesxt:TP6ZJb1OOZiacpl8@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const dataCollection = client.db("dataDB").collection("user");

    app.post("/data", async (req, res) => {
      const data = req.body;
      const result = await dataCollection.insertOne(data);
      res.send(result);
    });
    app.get("/data", async (req, res) => {
      const result = await dataCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("asgld!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
