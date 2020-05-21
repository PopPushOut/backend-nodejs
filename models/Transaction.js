const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
  sender: String,
  receiver: String,
  transfer_amount: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
