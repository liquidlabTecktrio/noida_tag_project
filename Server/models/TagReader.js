const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagReader = new Schema(
    {
        readerName: {
            type: String,
            required: true,
        },
        ipAddress:{
            type: String,
            required: true,
        },
        macAddress:{
            type: String,
            required: true,
        },
        readerNo: {
            type: Number,
            required: true,
        }
    },
);

module.exports = mongoose.model("TagReader", TagReader);
