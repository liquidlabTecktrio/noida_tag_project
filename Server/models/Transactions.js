const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Transactions = new Schema(
    {
         type: {
            type: String,
            required: true,
         },
         terminalId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
         },
         customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
         },
         date:{
            type: String,
            required: true,
         },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transactions", Transactions);
