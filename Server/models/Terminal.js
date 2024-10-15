const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Terminal = new Schema(
    {
        terminalName:{
            type: String,
        },
        type:{
            type: String,
            required: true,
        },
        tagReaderId:{
            type: mongoose.Schema.Types.ObjectId, 
            required: true,
        },
        barrierId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        isService: {
            type: Boolean,
            required: true,
        }
    },
);

module.exports = mongoose.model("Terminal", Terminal);