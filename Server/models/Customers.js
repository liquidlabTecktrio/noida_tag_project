const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Customers = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNo:{
            type: Number,
            required: true,
        },
        tagNo: {
            type: Number,
            required: true,

        },
        validity: {
            type: String,
            required: true,
        },
        blocklisted: {
            type: Boolean,
            required: true
        },
        status: {
            type: String,
            // required: true,
        }
    }
);

module.exports = mongoose.model("Customers", Customers);
