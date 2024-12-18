const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const url = process.env.MONGO_URI || "mongodb+srv://farhanghoriwork:gXO84mQrrrQAALtf@travelagency1.clmsb.mongodb.net/";
const dbName = "tourists";

// Create a single MongoDB connection instance
let client;
let db;

const connectDB = async () => {
    try {
        if (!client) {
            client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            db = client.db(dbName);
            console.log("MongoDB connected successfully!");
        }
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

module.exports = connectDB;
