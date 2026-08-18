const express = require("express");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const { connectMongo } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "frontend")));  
app.use(express.static(path.join(__dirname, "public")));    

app.use("/api/users", authRoutes);  
app.use("/", customerRoutes);       

module.exports = app;
