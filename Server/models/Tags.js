const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tags = new Schema(
    {
        tagNo: {
            type: Number,
            required: true,
        },
        epcCode: {
            type: Number,
            required: true,
        }
    }
);

module.exports = mongoose.model("Tags", Tags);
