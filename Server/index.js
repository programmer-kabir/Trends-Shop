const express = require("express");
const app = express();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore in environments where setting DNS servers is not supported
}
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");

process.on("uncaughtException", (err) => {
  console.error("Server uncaught exception (handled):", err.message);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Server unhandled rejection (handled):", reason);
});

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
    const requestPaymentCollection = client
      .db("TrendsShop")
      .collection("requestPayment");
    const reviewsCollection = client.db("TrendsShop").collection("reviews");
    const categoriesCollection = client.db("TrendsShop").collection("categories");
    const cartOffersCollection = client.db("TrendsShop").collection("cartOffers");

    // verifyAdmin middleware
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded?.email;
      if (!email) {
        return res
          .status(401)
          .send({ error: true, message: "unauthorized token" });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user?.role !== "admin") {
        return res
          .status(403)
          .send({ error: true, message: "forbidden access" });
      }
      next();
    };

    // JWT - Secure Token Generation with Verified Roles from Database
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const email = user?.email?.trim().toLowerCase();
      if (!email) {
        return res.status(400).send({ error: true, message: "Valid email is required" });
      }

      // Query true role from database to prevent clients from injecting 'admin' role
      const userRecord = await usersCollection.findOne({ email });
      const payload = {
        email,
        role: userRecord?.role || "user",
      };

      const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
        expiresIn: "24h",
      });
      res.send({ token });
    });

    // shoes get
    app.get("/shoes", async (req, res) => {
      const result = await shoesCollection.find().toArray();
      res.send(result);
    });

    app.post("/shoes", verifyJWT, verifyAdmin, async (req, res) => {
      const data = req.body;

      if (data?.Description?.Item_code) {
        const existingItem = await shoesCollection.findOne({
          $or: [
            { "Description.Item_code": data.Description.Item_code },
            { "formattedDescription.Item_code": data.Description.Item_code },
          ],
        });

        if (existingItem) {
          return res.status(400).send({ message: "Footwear Item Code already exists." });
        }
      }

      const result = await shoesCollection.insertOne(data);
      res.send(result);
    });

    app.patch("/shoes", verifyJWT, verifyAdmin, async (req, res) => {
      const { id, updatedData } = req.body;
      if (!id) {
        return res.status(400).send({ message: "Shoe ID required." });
      }
      const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
      const existingItem = await shoesCollection.findOne(query);
      if (!existingItem) {
        return res.status(404).send({ message: "Item not found." });
      }

      const cleanUpdate = { ...updatedData };
      delete cleanUpdate._id;

      const result = await shoesCollection.updateOne(query, {
        $set: cleanUpdate,
      });

      res.send({ message: "Item updated successfully.", result });
    });

    // shoe get
    app.get("/shoe/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
      const result = await shoesCollection.findOne(query);
      if (!result) {
        return res.status(404).send({ message: "Shoe not found" });
      }
      res.send(result);
    });

    app.delete("/shoe/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
      const result = await shoesCollection.deleteOne(query);
      res.send(result);
    });

    // ================= CATEGORY & SUBCATEGORY MANAGEMENT =================
    // GET all categories
    app.get("/categories", async (req, res) => {
      try {
        const categories = await categoriesCollection.find().toArray();
        res.send(categories);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch categories", error });
      }
    });

    // CREATE category
    app.post("/categories", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const { name, department, image, description, subcategories } = req.body;
        if (!name) {
          return res.status(400).send({ message: "Category name is required" });
        }
        const newCategory = {
          name: name.trim(),
          department: department || "MEN'S",
          image: image || "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
          description: description || "",
          subcategories: Array.isArray(subcategories)
            ? subcategories.map((s) => s.trim()).filter(Boolean)
            : [],
          createdAt: new Date(),
        };
        const result = await categoriesCollection.insertOne(newCategory);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to create category", error });
      }
    });

    // UPDATE category
    app.patch("/categories/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
        const updateDoc = { ...req.body };
        delete updateDoc._id; // prevent immutable _id update error
        const result = await categoriesCollection.updateOne(filter, {
          $set: updateDoc,
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update category", error });
      }
    });

    // DELETE category
    app.delete("/categories/:id", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
        const result = await categoriesCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete category", error });
      }
    });

    // ADD Subcategory to a Category
    app.post("/categories/:id/subcategory", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const { subcategory } = req.body;
        if (!subcategory || !subcategory.trim()) {
          return res.status(400).send({ message: "Subcategory name is required" });
        }
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
        const result = await categoriesCollection.updateOne(filter, {
          $addToSet: { subcategories: subcategory.trim() },
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add subcategory", error });
      }
    });

    // DELETE Subcategory from a Category
    app.delete("/categories/:id/subcategory/:subName", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const { id, subName } = req.params;
        const decodedSubName = decodeURIComponent(subName);
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
        const result = await categoriesCollection.updateOne(filter, {
          $pull: { subcategories: decodedSubName },
        });
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete subcategory", error });
      }
    });

    // User
    // Post all User (Registration)
    app.post("/users", async (req, res) => {
      const { name, email, photoURL } = req.body;
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
      const normalizedEmail = email.trim().toLowerCase();
      const query = { email: normalizedEmail };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist" });
      }

      // Enforce strict payload sanitization: role is always 'user' on creation
      const newUser = {
        name: name ? String(name).trim() : "Member",
        email: normalizedEmail,
        ...(photoURL && { photoURL: String(photoURL) }),
        role: "user", // Prevent client-side admin privilege escalation
        createdAt: new Date(),
      };
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // Update User Data (Protected: users can only update their own profile, cannot change role)
    app.put("/users", verifyJWT, async (req, res) => {
      const updatedUserData = req.body;
      const email = updatedUserData?.email?.trim().toLowerCase();
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Security Check: Decoded token email must match target email
      if (req.decoded?.email?.toLowerCase() !== email) {
        return res
          .status(403)
          .json({ error: true, message: "Forbidden: You cannot modify other user profiles" });
      }

      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Whitelist updateable fields, explicitly strip role, _id, email to prevent privilege escalation
      const cleanUpdate = { ...updatedUserData };
      delete cleanUpdate._id;
      delete cleanUpdate.role;
      delete cleanUpdate.email;

      const result = await usersCollection.updateOne(query, {
        $set: cleanUpdate,
      });
      res.send(result);
    });
    // Get all users (Admin only)
    app.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
      const user = await usersCollection.find().toArray();
      res.send(user);
    });

    // Get single user profile by email (Protected: user can view their own profile, or admin can view)
    app.get("/userProfile", verifyJWT, async (req, res) => {
      const email = req.query.email?.trim().toLowerCase();
      if (!email) {
        return res.status(400).send({ message: "Email parameter required" });
      }

      const callerEmail = req.decoded?.email?.trim().toLowerCase();
      const caller = await usersCollection.findOne({ email: callerEmail });
      const isAdmin = caller?.role === "admin";

      if (callerEmail !== email && !isAdmin) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: Cannot view another user's profile" });
      }

      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user || {});
    });

    // Update user to admin (Admin only)
    app.patch("/users/admin/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Get admin status
    app.get("/users/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;

      if (req.decoded?.email !== email) {
        return res.send({ admin: false });
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === "admin" };
      return res.send(result);
    });

    app.post("/booked", verifyJWT, async (req, res) => {
      const body = req.body;
      const id = body.productId;
      const email = body.email;
      const incomingSize = body.size;
      const incomingQuantity = body.quantity || 1;

      if (!email || req.decoded?.email?.toLowerCase() !== email.toLowerCase()) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: Cannot add items to another user's cart" });
      }

      const filter = { productId: id, email };

      try {
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

    app.get("/booked", verifyJWT, async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.send([]);
      }

      const callerEmail = req.decoded?.email;
      const user = await usersCollection.findOne({ email: callerEmail });
      const isAdmin = user?.role === "admin";
      if (email.toLowerCase() !== callerEmail?.toLowerCase() && !isAdmin) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: Cannot view another customer's cart" });
      }

      const query = { email: email };
      const data = await bookedCollection.find(query).toArray();
      res.send(data);
    });

    app.delete("/book/:id", verifyJWT, async (req, res) => {
      const { id } = req.params;
      const callerEmail = req.decoded?.email;
      const query = { _id: ObjectId.isValid(id) ? new ObjectId(id) : id };

      const existingItem = await bookedCollection.findOne(query);
      if (!existingItem) {
        return res.status(404).send({ message: "Item not found" });
      }

      // Check if user is owner of the booking or an admin
      const user = await usersCollection.findOne({ email: callerEmail });
      const isAdmin = user?.role === "admin";
      if (existingItem.email?.toLowerCase() !== callerEmail?.toLowerCase() && !isAdmin) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: You cannot delete another customer's cart item" });
      }

      const result = await bookedCollection.deleteOne(query);
      res.send(result);
    });

    // Get all users' cart data (Admin only for Abandoned Carts management)
    app.get("/userBookedData", verifyJWT, verifyAdmin, async (req, res) => {
      const data = await bookedCollection.find().toArray();
      res.send(data);
    });

    // Coupon
    app.get("/couponCode", async (req, res) => {
      const data = await couponCollection.find().toArray();
      res.send(data);
    });
    app.post("/couponCode", verifyJWT, verifyAdmin, async (req, res) => {
      const body = req.body;
      const { code } = req.body;
      const existingCoupon = await couponCollection.findOne({ code });
      if (existingCoupon) {
        return res.status(400).json({ message: "Coupon name already exists." });
      }

      const data = await couponCollection.insertOne(body);
      res.send(data);
    });

    app.delete("/couponCode/:id", verifyJWT, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      try {
        const query = {
          _id: ObjectId.isValid(id) ? new ObjectId(id) : id,
        };
        const result = await couponCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error deleting coupon:", error);
        return res.status(500).json({ message: "Failed to delete coupon" });
      }
    });

    // Cart Offers (Targeted Offers for Cart Abandoners)
    app.post("/cartOffers", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const offerData = req.body;
        offerData.createdAt = new Date();
        const result = await cartOffersCollection.insertOne(offerData);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to record cart offer", error });
      }
    });

    app.get("/cartOffers", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const result = await cartOffersCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch cart offers", error });
      }
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

    // Robust Invoice ID Generator (matches TR-YYMMDD-NN standard format)
    const generateUniqueInvoiceId = async (collection) => {
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const prefix = `TR-${yy}${mm}${dd}`;

      const count = await collection.countDocuments({
        invoiceId: { $regex: `^${prefix}` },
      });

      let nextNum = count + 1;
      let candidate = `${prefix}-${String(nextNum).padStart(2, "0")}`;
      while (await collection.findOne({ invoiceId: candidate })) {
        nextNum++;
        candidate = `${prefix}-${String(nextNum).padStart(2, "0")}`;
      }
      return candidate;
    };

    // Payment / Order Placement
    app.post("/requestPayment", verifyJWT, async (req, res) => {
      const data = req.body;
      const callerEmail = req.decoded?.email;
      if (!callerEmail || callerEmail.toLowerCase() !== data?.email?.toLowerCase()) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: Cannot submit payment on behalf of another user" });
      }

      try {
        const invoiceId = await generateUniqueInvoiceId(requestPaymentCollection);
        data.invoiceId = invoiceId;
        data.status = data.status || "Awaiting Check Payment";
        data.orderDate = data.orderDate || new Date().toISOString().split("T")[0];
        data.createdAt = new Date();

        // CASE 1: Multi-Item Unified Order (e.g. 4 products with 1 delivery charge)
        if (Array.isArray(data.items) && data.items.length > 0) {
          const verifiedItems = [];
          let computedSubTotal = 0;

          for (const item of data.items) {
            let itemPrice = Number(item.price) || 0;
            let itemQty = Number(item.quantity) || 1;

            if (item.bookedId && ObjectId.isValid(item.bookedId)) {
              const b = await bookedCollection.findOne({
                _id: new ObjectId(item.bookedId),
                email: callerEmail,
              });
              if (b && b.price) {
                itemPrice = Number(b.price);
              }
            }

            computedSubTotal += itemPrice * itemQty;
            verifiedItems.push({
              productId: item.productId,
              productName: item.productName || item.name || "Footwear Article",
              size: item.size || "Standard",
              quantity: itemQty,
              price: itemPrice,
              image: item.image || "",
              bookedId: item.bookedId || null,
            });
          }

          const shippingCost = Number(data.shippingCost) || 0;
          const discount = Number(data.discount) || 0;
          const totalAmount = Math.max(0, computedSubTotal + shippingCost - discount);

          data.items = verifiedItems;
          data.subTotal = computedSubTotal;
          data.price = computedSubTotal; // backward compatibility for admin revenue calculations
          data.shippingCost = shippingCost;
          data.discount = discount;
          data.totalAmount = totalAmount;

          const paymentResult = await requestPaymentCollection.insertOne(data);

          // Update matching bookings status and attach invoiceId
          const bookedIds = verifiedItems
            .map((it) => it.bookedId)
            .filter((id) => id && ObjectId.isValid(id))
            .map((id) => new ObjectId(id));

          let bookedUpdateResult = { matchedCount: 0 };
          if (bookedIds.length > 0) {
            bookedUpdateResult = await bookedCollection.updateMany(
              { _id: { $in: bookedIds }, email: callerEmail },
              { $set: { status: "Awaiting Check Payment", invoiceId } }
            );
          } else {
            bookedUpdateResult = await bookedCollection.updateMany(
              { email: callerEmail, status: { $in: ["Pending", "In Bag", undefined, null] } },
              { $set: { status: "Awaiting Check Payment", invoiceId } }
            );
          }

          return res.send({
            message: "Multi-item order placed successfully",
            paymentResult,
            bookedUpdateResult,
            invoiceId,
          });
        }

        // CASE 2: Legacy Single-Item Order
        const { bookedId } = data;
        if (!bookedId || !ObjectId.isValid(bookedId)) {
          return res.status(400).send({ message: "Valid bookedId or items array is required" });
        }

        const filter = { _id: new ObjectId(bookedId), email: callerEmail };
        const existingBooking = await bookedCollection.findOne(filter);
        if (!existingBooking) {
          return res.status(404).send({
            message: "No matching booking found for this account",
          });
        }

        if (existingBooking.price) {
          data.price = Number(existingBooking.price);
        }

        const paymentResult = await requestPaymentCollection.insertOne(data);

        if (paymentResult.insertedId) {
          const update = { $set: { status: "Awaiting Check Payment", invoiceId } };
          const bookedUpdateResult = await bookedCollection.updateMany(
            filter,
            update
          );

          return res.send({
            message: "Payment recorded and booking status updated successfully",
            paymentResult,
            bookedUpdateResult,
            invoiceId,
          });
        } else {
          return res.status(500).send({ message: "Failed to insert payment data" });
        }
      } catch (error) {
        console.error("requestPayment error:", error);
        return res.status(500).send({ message: "Server error" });
      }
    });

    app.patch("/requestPayment", verifyJWT, verifyAdmin, async (req, res) => {
      const { paymentId, newStatus, bookedId, productId, deliveryDate } =
        req.body;

      try {
        // Step 1: Find the existing payment by paymentId
        const paymentFilter = { _id: new ObjectId(paymentId) };
        const existingPayment = await requestPaymentCollection.findOne(
          paymentFilter
        );

        if (!existingPayment) {
          return res.status(404).json({ message: "Payment not found" });
        }

        if (!newStatus) {
          return res.status(400).json({ message: "New status not provided" });
        }

        // Step 2: Check if we have a "Transition ID Error" status to clear `invoiceId`
        if (newStatus === "Transition ID Error") {
          // Remove the invoiceId from all bookings with the specified `bookedId`
          await bookedCollection.updateMany(
            { _id: new ObjectId(bookedId) },
            { $unset: { invoiceId: "" }, $set: { status: newStatus } }
          );
          await requestPaymentCollection.updateOne(paymentFilter, {
            $unset: { invoiceId: "" },
            $set: { status: newStatus },
          });

          return res.status(200).json({
            message: `Invoice ID removed for booking with ID ${bookedId} due to Transition ID Error.`,
          });
        }

        // Step 3: Generate a unique invoice ID if not already present
        let newInvoiceId = existingPayment.invoiceId;

        if (!existingPayment.invoiceId) {
          newInvoiceId = await generateUniqueInvoiceId(requestPaymentCollection);
        }

        // Update the payment status and new invoiceId only if the invoiceId was newly generated
        const paymentUpdate = {
          $set: {
            deliveryDate,
            status: newStatus,
            ...(existingPayment.invoiceId ? {} : { invoiceId: newInvoiceId }),
          },
        };
        await requestPaymentCollection.updateOne(paymentFilter, paymentUpdate);

        // Step 5: Check for an existing booking entry in bookedCollection if bookedId provided
        let updatedBooking = null;
        if (bookedId && ObjectId.isValid(bookedId)) {
          const bookingFilter = { _id: new ObjectId(bookedId) };
          const existingBooking = await bookedCollection.findOne(bookingFilter);

          if (existingBooking) {
            const bookingInvoiceId = existingBooking.invoiceId;
            const bookingUpdate = {
              $set: {
                status: newStatus,
                invoiceId: bookingInvoiceId || newInvoiceId,
              },
            };

            await bookedCollection.updateOne(bookingFilter, bookingUpdate);
            updatedBooking = await bookedCollection.findOne(bookingFilter);
          }
        }

        // Fetch the updated payment record
        const updatedPayment = await requestPaymentCollection.findOne(
          paymentFilter
        );

        if (newStatus === "Delivery") {
          if (Array.isArray(existingPayment.items) && existingPayment.items.length > 0) {
            for (const item of existingPayment.items) {
              if (item.productId) {
                const pFilter = {
                  _id: ObjectId.isValid(item.productId) ? new ObjectId(item.productId) : item.productId,
                };
                await shoesCollection.updateOne(pFilter, {
                  $inc: { selling: Number(item.quantity) || 1 },
                });
              }
            }
          } else if (productId) {
            const productFilter = {
              _id: ObjectId.isValid(productId) ? new ObjectId(productId) : productId,
            };
            await shoesCollection.updateOne(productFilter, { $inc: { selling: 1 } });
          }
        }

        // Return success response
        return res.status(200).json({
          message: `Payment and booking status updated to ${newStatus}, Invoice ID: ${newInvoiceId}`,
          payment: updatedPayment,
          booking: updatedBooking,
        });
      } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: "Server error" });
      }
    });

    app.get("/requestPayment", verifyJWT, async (req, res) => {
      const email = req.query.email;
      const callerEmail = req.decoded?.email;
      const user = await usersCollection.findOne({ email: callerEmail });
      const isAdmin = user?.role === "admin";

      if (email) {
        if (email.toLowerCase() !== callerEmail?.toLowerCase() && !isAdmin) {
          return res
            .status(403)
            .send({ error: true, message: "Forbidden: Cannot view other customers' payment records" });
        }
        const query = { email: email };
        const result = await requestPaymentCollection.find(query).toArray();
        return res.send(result);
      }

      // If no email query is provided (viewing all orders) -> Admin only!
      if (!isAdmin) {
        return res
          .status(403)
          .send({ error: true, message: "Forbidden: Admin privileges required to view all payment records" });
      }

      const result = await requestPaymentCollection.find({}).toArray();
      res.send(result);
    });

    // Reviews
    app.post("/reviews", async (req, res) => {
      const body = req.body;

      const result = await reviewsCollection.insertOne(body);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB successfully!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Ok!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
