const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    requester: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    status: { type: String, enum: ['pending','accepted'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Connection', connectionSchema);
