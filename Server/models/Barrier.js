const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Barrier = new Schema(
    {
        barrierName: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        macAddress: {
            type: String,
            required: true,
        },
        barrierNo: {
            type: Number,
            required: true,
        }
    }
);

module.exports = mongoose.model("Barrier", Barrier);