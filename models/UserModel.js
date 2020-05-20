const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  first_name: { type: String, required: true }, // String is shorthand for {type: String}
  last_name: String,
  country: String,
  account_country: String,
  date: { type: Date, default: Date.now },
  importance: { type: Number, min: 0, max: 10, required: true },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

module.exports = mongoose.model("User", userSchema, "users");
