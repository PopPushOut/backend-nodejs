const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let transactionSchema = new Schema(
  {
    receiver: { type: String, required: "Please fill the Receiver field" },
    transfer_amount: {
      type: Number,
      required: "Please put the amount you are sending",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "Transaction should belong to a User",
    },
    state: {
      type: String,
      enum: ["New", "Cancelled", "Completed"],
      default: "New",
    },
  },
  {
    timestamps: { createdAt: "created", updatedAt: "updated" },
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
