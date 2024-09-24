const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const shoesCollection = client.db("TrendsShop").collection("shoes");
    const usersCollection = client.db("TrendsShop").collection("users");
    const divisionCollection = client.db("TrendsShop").collection("divisions");
    const districtCollection = client.db("TrendsShop").collection("districts");
    const upZillahCollection = client.db("TrendsShop").collection("upZillahs");
    const bookedCollection = client.db("TrendsShop").collection("booked");

    // shoes get
    app.get("/shoes", async (req, res) => {
      const result = await shoesCollection.find().toArray();
      res.send(result);
    });

    // User
    // Post all User
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Update User Data
    app.put("/users", async (req, res) => {
      const updatedUserData = req.body;
      console.log(updatedUserData);
      const query = { email: updatedUserData.email };
      const existingUser = await usersCollection.findOne(query);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const result = await usersCollection.updateOne(query, {
        $set: updatedUserData,
      });
      res.send(result);
    });
    // Get all user
    app.get("/users", async (req, res) => {
      const user = await usersCollection.find().toArray();
      res.send(user);
    });


    // User Booked Data
    // app.post('/booked',async(req, res) =>{
    //   const body = req.body
    //   // console.log(body);
    //   const id = body.productId;
    //   const email = body.email;
    //   const filter = { productId: id, email };
    //   const incomingQuantity = body.quantity || 1;
    //   const incomingSize = body.size;

    //   console.log(incomingQuantity);
    //   try{

    //     const existingData  = await bookedCollection.findOne(filter);
    //     if (existingData ) {
    //       const updateResult = await bookedCollection.updateOne(
    //         filter,
    //         { $inc: { quantity: incomingQuantity } } // Increment the quantity field by the incoming quantity
    //       );
    //       res.send({ message: "Quantity updated successfully", updateResult });
    //     } else {
    //       const result = await bookedCollection.insertOne(body);
    //       res.send(result);
    //     }
    //   }
    //   catch(error){
    //     res.status(500).send({ message: "Server error" });
    //   }
    // })

    app.post('/booked', async (req, res) => {
      const body = req.body;
      const id = body.productId;
      const email = body.email;
      const incomingSize = body.size;
      const incomingQuantity = body.quantity || 1;
    
      const filter = { productId: id, email };
    
      try {
        // Find if the item already exists in the bookedCollection
        const existingData = await bookedCollection.findOne(filter);
    
        if (existingData) {
          // Check if the sizes field is already an array
          if (Array.isArray(existingData.size)) {
            // If size is already an array, add the incoming size if it doesn't exist
            const updateResult = await bookedCollection.updateOne(
              filter,
              {
                $inc: { quantity: incomingQuantity }, // Increment the quantity field
                $addToSet: { size: incomingSize } // Add size to the size array if it doesn't already exist
              }
            );
            res.send({ message: "Quantity updated and size added successfully", updateResult });
          } else {
            // If size is not an array, convert it to an array and add the new size
            const updatedSizes = [existingData.size, incomingSize];
            const updateResult = await bookedCollection.updateOne(
              filter,
              {
                $inc: { quantity: incomingQuantity }, // Increment the quantity field
                $set: { size: updatedSizes } // Convert the size to an array with the existing and incoming sizes
              }
            );
            res.send({ message: "Quantity updated and size array created", updateResult });
          }
        } else {
          // If item does not exist, insert a new entry with the size as a single value
          const result = await bookedCollection.insertOne(body);
          res.send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });
    
    app.get("/booked", async (req, res) => {
      const result = await bookedCollection.find().toArray();
      res.send(result);
    });

    // Address
    app.get("/districts", async (req, res) => {
      const district = await districtCollection.find().toArray();
      res.send(district);
    });
    // division
    app.get("/divisions", async (req, res) => {
      const divisions = await divisionCollection.find().toArray();
      res.send(divisions);
    });
    // upzillah
    app.get("/upZillahs", async (req, res) => {
      const upZillahs = await upZillahCollection.find().toArray();
      res.send(upZillahs);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Ok!");
});

app.listen(port, () => {});
