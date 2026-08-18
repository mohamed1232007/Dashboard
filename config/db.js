const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
const path = require("path");
const dns = require("dns");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

dns.setDefaultResultOrder("ipv4first");

const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 15000,
    ssl: process.env.DB_SSL === "false" ? undefined : { rejectUnauthorized: false },
});

let isMongoConnected = false;

async function connectMongo() {
    if (isMongoConnected) return;
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            isMongoConnected = true;
            console.log("MongoDB connected successfully");
        }
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
    }
}

module.exports = { mysqlPool, connectMongo };