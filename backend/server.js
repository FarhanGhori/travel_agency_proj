const { MongoClient} = require("mongodb")
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import the db connection function
const generateInvoice = require("./utils/generateInvoice"); // Import the invoice generator

const app = express();
dotenv.config(); // Load environment variables

app.use(express.json());
app.use(cors());

// MongoDB connection using db.js
connectDB(); // Call the function to establish the connection

const url = "mongodb+srv://farhanghoriwork:gXO84mQrrrQAALtf@travelagency1.clmsb.mongodb.net/";
const dbName = "tourists";
async function connectToMongoDB_tasks() {
    const client = new MongoClient(url);
    try {
      await client.connect();
      console.log("MongoDB connected successfully 1.");
      return client.db(dbName).collection("packages");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
  
  async function connectToMongoDB_tasks1() {
      const client = new MongoClient(url);
      try {
        await client.connect();
        console.log("MongoDB connected successfully 1.");
        return client.db(dbName).collection("bookings");
      } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
      }
    }

// Route to get all packages
app.get("/packages/", async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection("packages");
        const packages = await collection.find().toArray();
        res.status(200).json(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ error: "An error occurred while retrieving packages" });
    }
});

// Route to create a booking
app.post("/bookings", async (req, res) => {
    try {
        const { name, email, phone, travelers, specialRequest, title } = req.body;

        // Log the incoming booking data for debugging
        console.log("Incoming Booking Data:", req.body);

        // Input validation: Check for missing fields
        if (!name || !email || !phone || !travelers || !title) {
            return res.status(400).json({ error: "Missing required fields: name, email, phone, travelers, or title" });
        }

        // Connect to the database
        const db = await connectToMongoDB_tasks();
        

        // Fetch the package details by title
        const selectedPackage = await db.findOne({ title: title });
        console.log("Fetched Package:", selectedPackage); // Debugging

        if (!selectedPackage) {
            return res.status(404).json({ error});
        }

        // Check if the 'price' field exists
        if (!selectedPackage.price) {
            return res.status(400).json({ error: "The selected package does not have a valid price field" });
        }

        // Calculate the total price
        const totalPrice = selectedPackage.price * parseInt(travelers, 10);

        // Prepare booking details
        const bookingDetails = {
            name,
            email,
            phone,
            travelers: parseInt(travelers, 10),
            specialRequest: specialRequest || "",
            packageTitle: title,
            packageId: selectedPackage._id, // Reference the package ID
            totalPrice,
            createdAt: new Date(),
        };
        const db1= await connectToMongoDB_tasks1();
        // Save the booking to the 'bookings' collection
        const result = await db1.insertOne(bookingDetails);

        // Log the result for debugging
        console.log("Booking Insert Result:", result);

        // Generate the invoice (optional, depends on your function)
        const invoice = generateInvoice(bookingDetails);

        // Respond to the client
        res.status(201).json({
            message: "Booking successfully created",
            bookingId: result.insertedId,
            invoice,
        });
    } catch (error) {
        console.error("Error in creating booking:", error);
        res.status(500).json({ error: "An internal error occurred while creating the booking" });
    }
});

// Route to add a package (Admin)
app.post("/admin/packages", async (req, res) => {
    try {
        const { title, description, price, availableDates, image } = req.body;
        if (!title || !description || !price || !availableDates || !image) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newPackage = {
            title,
            description,
            price,
            availableDates,
            image,
            createdAt: new Date(),
        };

        const db = await connectDB();
        const collection = db.collection("packages");
        const result = await collection.insertOne(newPackage);

        res.status(201).json({
            message: "Package successfully added",
            packageId: result.insertedId,
        });
    } catch (error) {
        console.error("Error adding package:", error);
        res.status(500).json({ error: "An error occurred while adding the package" });
    }
});

// Route to update a package (Admin)
app.put("/admin/packages/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        const db = await connectDB();
        const collection = db.collection("packages");

        // Update the package based on title
        const result = await collection.updateOne(
            { title }, // Filter condition
            { $set: updateData } // Update data
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Package not found" });
        }

        res.status(200).json({
            message: "Package updated successfully",
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ error: "An error occurred while updating the package" });
    }
});

// Route to delete a package (Admin)
const { ObjectId } = require("mongodb");

app.delete("/admin/packages/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extract the id from the URL
        console.log(id);
        const db = await connectDB();
        const collection = db.collection("packages");

        // Check if the package exists
        const package = await collection.findOne({ _id: new ObjectId(id) });
        if (!package) {
            return res.status(404).json({ error: "Package not found" });
        }

        // Delete the package
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Package not found" });
        }

        res.status(200).json({
            message: "Package deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ error: "An error occurred while deleting the package" });
    }
});

// Start the server
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
