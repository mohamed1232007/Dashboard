const express = require("express");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const { connectMongo } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

// Middlewares الأساسية
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// ضبط الـ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// الملفات الثابتة
app.use(express.static(path.join(__dirname, "frontend")));  
app.use(express.static(path.join(__dirname, "public")));    

// اتصال قواعد البيانات للـ Serverless
app.use(async (req, res, next) => {
    try {
        await connectMongo();
    } catch (e) {
        console.error("Mongo DB connection error:", e);
    }
    next();
});

// المسارات (Routes)
app.use("/api/users", authRoutes);  
app.use("/", customerRoutes);       

module.exports = app;