const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    emailId: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema)


