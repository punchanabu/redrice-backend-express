const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Example = mongoose.model("Example", exampleSchema);

module.exports = Example;
