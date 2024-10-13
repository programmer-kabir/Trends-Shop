const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//Middleware
app.use(cors());
app.use(express.json());

// .Middleware use verify
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: "unauthorized token" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized token" });
    }
    req.decoded = decoded;
    next();
  });
};
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const couponCollection = client.db("TrendsShop").collection("coupon");
    const requestPaymentCollection = client.db("TrendsShop").collection("requestPayment");

        // JWT
        app.post("/jwt", (req, res) => {
          const user = req.body;
          const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
            expiresIn: "1h",
          });
          res.send({ token });
        });
    


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
      // console.log(updatedUserData);
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

    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user?.role !== "admin") {
        return res
          .status(403)
          .send({ error: true, message: "forbidden access" });
      }
      next();
    };
    // Update user to admin
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // console.log(filter);
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Get admin
    app.get("/users/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ admin: false });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === "admin" };
      res.send(result);
    });


    app.post("/booked", async (req, res) => {
      const body = req.body;
      const id = body.productId;
      const email = body.email;
      const incomingSize = body.size;
      const incomingQuantity = body.quantity || 1;

      const filter = { productId: id, email };

      try {
        // Genarate Invoice Number

        // Find if the item already exists in the bookedCollection
        const existingData = await bookedCollection.findOne(filter);

        if (existingData) {
          // Check if the sizes field is already an array
          if (Array.isArray(existingData.size)) {
            // If size is already an array, add the incoming size if it doesn't exist
            const updateResult = await bookedCollection.updateOne(filter, {
              $inc: { quantity: incomingQuantity }, // Increment the quantity field
              $addToSet: { size: incomingSize }, // Add size to the size array if it doesn't already exist
            });
            res.send({
              message: "Quantity updated and size added successfully",
              updateResult,
            });
          } else {
            // If size is not an array, convert it to an array and add the new size
            const updatedSizes = [existingData.size, incomingSize];
            const updateResult = await bookedCollection.updateOne(filter, {
              $inc: { quantity: incomingQuantity }, // Increment the quantity field
              $set: { size: updatedSizes }, // Convert the size to an array with the existing and incoming sizes
            });
            res.send({
              message: "Quantity updated and size array created",
              updateResult,
            });
          }
        } else {
          // If item does not exist, insert a new entry with the size as a single value
          const result = await bookedCollection.insertOne(body);
          res.send(result);
        }
      } catch (error) {
        // console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.get("/booked", async (req, res) => {
      const email = req.query.email;
      // console.log(email);
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const data = await bookedCollection.find(query).toArray();
      res.send(data);
    });
    app.get("/userBookedData", async (req, res) => {
      const data = await bookedCollection.find().toArray();
      res.send(data);
    });

    // Coupon 
    app.get("/couponCode", async (req, res) => {
      const data = await couponCollection.find().toArray();
      res.send(data);
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

    // Payment
    app.post('/requestPayment', async (req, res) => {
      const data = req.body;
    
      try {
        // Step 1: Insert payment data into requestPaymentCollection
        const paymentResult = await requestPaymentCollection.insertOne(data);
    
        if (paymentResult.insertedId) {
          // Step 2: Extract productId and email from payment data
          const { bookedId, email } = data;
          // Step 3: Find the matching booking record in bookedCollection where productId matches the id
          const filter = { _id: new ObjectId(bookedId), email }; // Convert 'products' to an ObjectId
          // Step 4: Update the status only if the booking exists
          const update = { $set: { status: "Awaiting Check Payment" } }; // Set the status to 'Awaiting Check Payment'
    
          // Check if a matching booking exists in bookedCollection
          const existingBooking = await bookedCollection.findOne(filter);
          // console.log(existingBooking);
          if (existingBooking) {
            // Proceed to update status in the booked collection
            const bookedUpdateResult = await bookedCollection.updateMany(filter, update);
    
            if (bookedUpdateResult.matchedCount > 0) {
              res.send({
                message: "Payment recorded and booking status updated successfully",
                paymentResult,
                bookedUpdateResult,
              });
            } else {
              res.status(404).send({ message: "No matching booking found to update status" });
            }
          } else {
            // If no matching booking exists, do not proceed with updating status
            res.status(404).send({ message: "No matching booking found with the given productId and email" });
          }
        } else {
          res.status(500).send({ message: "Failed to insert payment data" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
      }
    });


    app.patch('/requestPayment', async (req, res) => {
      const { paymentId, newStatus, bookedId } = req.body;
    
      try {
        // Step 1: Find the existing payment by paymentId
        const paymentFilter = { _id: new ObjectId(paymentId) };
        const existingPayment = await requestPaymentCollection.findOne(paymentFilter);
    
        if (!existingPayment) {
          return res.status(404).json({ message: "Payment not found" });
        }
    
        if (!newStatus) {
          return res.status(400).json({ message: "New status not provided" });
        }
    
        // Step 2: Check if the payment already has an invoiceId
        let newInvoiceId = existingPayment.invoiceId;
        
        if (!existingPayment.invoiceId) {
          // Step 3: Generate a new unique invoice ID (e.g., tr00001, tr00002, etc.)
          const lastPayment = await requestPaymentCollection
            .find({})
            .sort({ invoiceId: -1 })
            .limit(1)
            .toArray();
    
          if (lastPayment.length === 0 || !lastPayment[0].invoiceId) {
            newInvoiceId = "tr00001"; // Start with tr00001 if no payments exist
          } else {
            // Increment the numeric part of the last invoice ID
            const lastInvoiceId = lastPayment[0].invoiceId;
            const invoiceNumber = parseInt(lastInvoiceId.slice(2)) + 1; // Extract the numeric part and increment it
            newInvoiceId = "tr" + invoiceNumber.toString().padStart(5, "0"); // Create new invoice ID with padded zeros
          }
        }
    
        // Step 4: Update the payment status and set the new invoiceId in requestPaymentCollection, but only if the invoiceId was newly generated
        const paymentUpdate = {
          $set: {
            status: newStatus,
            ...(existingPayment.invoiceId ? {} : { invoiceId: newInvoiceId }), // Only set invoiceId if it doesn't already exist
          },
        };
        await requestPaymentCollection.updateOne(paymentFilter, paymentUpdate);
    
        // Step 5: Check if the bookedId matches any document in bookedCollection
        const bookingFilter = { _id: new ObjectId(bookedId) };
        const existingBooking = await bookedCollection.findOne(bookingFilter);
    
        if (!existingBooking) {
          return res.status(404).json({ message: "No matching booking found for the provided bookedId" });
        }
    
        // Step 6: Update the booking status and set the new invoiceId in bookedCollection, but only if the invoiceId was newly generated
        const bookingUpdate = {
          $set: {
            status: newStatus,
            ...(existingBooking.invoiceId ? {} : { invoiceId: newInvoiceId }), // Only set invoiceId if it doesn't already exist
          },
        };
        await bookedCollection.updateOne(bookingFilter, bookingUpdate);
    
        // Step 7: Fetch the updated payment and booking for the response
        const updatedPayment = await requestPaymentCollection.findOne(paymentFilter);
        const updatedBooking = await bookedCollection.findOne(bookingFilter);
    
        // Step 8: Return the success response
        return res.status(200).json({
          message: `Payment and booking status updated to ${newStatus}, Invoice ID: ${newInvoiceId}`,
          payment: updatedPayment,
          booking: updatedBooking,
        });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    });
    
    // Payment Update Admin
// app.patch('/requestPayment', async (req, res) => {
//   const { paymentId, newStatus, bookedId } = req.body;

//   try {
//     // Step 1: Find the existing payment by paymentId
//     const paymentFilter = { _id: new ObjectId(paymentId) };
//     const existingPayment = await requestPaymentCollection.findOne(paymentFilter);

//     if (!existingPayment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (!newStatus) {
//       return res.status(400).json({ message: "New status not provided" });
//     }

//     // Step 2: Update the payment status in requestPaymentCollection
//     const paymentUpdate = { $set: { status: newStatus } };
//     await requestPaymentCollection.updateOne(paymentFilter, paymentUpdate);

//     // Step 3: Check if the bookedId matches any document in bookedCollection
//     const bookingFilter = { _id: new ObjectId(bookedId) };
//     const existingBooking = await bookedCollection.findOne(bookingFilter);

//     if (!existingBooking) {
//       return res.status(404).json({ message: "No matching booking found for the provided bookedId" });
//     }

//     // Step 4: Update the booking status in bookedCollection
//     const bookingUpdate = { $set: { status: newStatus } };
//     await bookedCollection.updateOne(bookingFilter, bookingUpdate);

//     // Step 5: Fetch the updated payment and booking for the response
//     const updatedPayment = await requestPaymentCollection.findOne(paymentFilter);
//     const updatedBooking = await bookedCollection.findOne(bookingFilter);

//     // Step 6: Return the success response
//     return res.status(200).json({
//       message: `Payment and booking status updated to ${newStatus}`,
//       payment: updatedPayment,
//       booking: updatedBooking,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

    app.get('/requestPayment', async(req, res) =>{
      const result  = await requestPaymentCollection.find().toArray()
      res.send(result)
    })
    


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
