const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpSchema = new mongoose.Schema({
    email: String,
    otp: Number,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 
    }
});

module.exports = mongoose.model('Otp', OtpSchema);