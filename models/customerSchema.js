const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fireName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    age: Number,
    country: String,
    gender: String,
}, { timestamps: true });

const User = mongoose.model("customer", userSchema);

module.exports = User;












