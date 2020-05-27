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
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Transaction amount should be greater than 0",
      },
      required: "Please put the amount you are sending",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: "Transaction should belong to a User",
    },
    state: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: { createdAt: "created", updatedAt: "updated" },
  }
);

transactionSchema.statics.getTransactionIds = function (typeKey, priorityKey) {
  // type[typeKey] is used to compare whether account is domestic or international
  // [0] - we expect domestic transaction as sender and receiver account_country is same, e.g LT->LT or EN->EN
  // [1,-1] - we expect international transaction as sender and receiver account_country is different, e.g EN->LT or DE->EN
  const type = {
    international: [-1, 1],
    domestic: [0],
  };

  // map sender importance with priority, e.g user with importance = 6, has low priority
  const priority = {
    high: [0, 1, 2, 3, 4, 5],
    low: [6, 7, 8, 9, 10],
  };
  return this.aggregate([
    {
      $match: {
        state: "Pending",
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
        priority: "$sender_object.importance",
      },
    },
    {
      $match: {
        $and: [
          { domestic: { $in: type[typeKey] } },
          { priority: { $in: priority[priorityKey] } },
        ],
      },
    },
    {
      $group: { _id: null, array: { $push: "$_id" } },
    },
    {
      $unset: ["_id"],
    },
  ]);
};
transactionSchema.statics.processMultipleTransactions = function (
  transactionIdsArray
) {
  return this.updateMany(
    { _id: { $in: transactionIdsArray } },
    { $set: { state: "Completed" } }
  );
};
module.exports = mongoose.model("Transaction", transactionSchema);
