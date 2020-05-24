const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const md5 = require("md5");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

let userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid Email Address"],
      required: "Please Supply an Email Address",
    },
    name: {
      type: String,
      trim: true,
      required: "Please Provide a Name",
    },
    nationality: {
      type: String,
      required: "Please Select your nationality",
    },
    account_country: {
      type: String,
      required: "Please Select your account country",
    },
    date: { type: Date, default: Date.now },
    importance: { type: Number, min: 0, max: 10, required: true },
  },
  {
    toJSON: { virtuals: true },
    timestamps: { createdAt: "created", updatedAt: "updated" },
  }
);
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

userSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "user",
});

module.exports = mongoose.model("User", userSchema);
