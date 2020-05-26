const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let transactionSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "Transaction should be sent to an existing User",
    },
    transfer_amount: {
      type: Number,
      required: "Please put the amount you are sending",
    },
    sender: {
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

transactionSchema.statics.getTransactionIds = function (key) {
  // type[key] is later used in $in expression to match transactions
  // [0] - after $cmp accounts are equal, e.g LT->LT or EN->EN
  // [1,-1] - after $cmp accounts are different, e.g EN->LT or DE->EN
  const type = {
    international: [-1, 1],
    domestic: [0],
  };
  console.log(type[key]);
  return this.aggregate([
    {
      $match: {
        state: "New",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender_object",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver_object",
      },
    },
    {
      $project: {
        domestic: {
          $cmp: [
            "$receiver_object.account_country",
            "$sender_object.account_country",
          ],
        },
      },
    },
    { $match: { domestic: { $in: type[key] } } },
    {
      $group: { _id: null, array: { $push: "$_id" } },
    },
    {
      $unset: ["_id"],
    },
  ]);
};

module.exports = mongoose.model("Transaction", transactionSchema);
