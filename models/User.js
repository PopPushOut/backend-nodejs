const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const md5 = require("md5");
const validator = require("validator");
const passportLocalMongoose = require("passport-local-mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

let userSchema = new Schema({
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
  },
  surname: String,
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
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

// userSchema.methods.comparePassword = function (candidatePassword, next) {
//   bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
//     if (err) return next(err);
//     next(null, isMatch);
//   });
// };
module.exports = mongoose.model("User", userSchema);
