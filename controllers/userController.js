const User = require("../models/User");
const { body, check, validationResult } = require("express-validator");

exports.registerForm = (req, res) => {
  res.render("register", { title: "Register" });
};
exports.register = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    importance: 5,
  });
  let insertedUser = await User.register(user, req.body.password);
  res.json(insertedUser);
  //next();
};
exports.loginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.sanitizers = () => {
  return [];
};
exports.validateRegister = (req, res, next) => {
  // little bit of error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors.array().map((err) => err.msg)
    );
    res.render("register", {
      title: "Register",
      flashes: req.flash(),
    });
    return;
  }
  next();
};
exports.getUserById = async (req, res) => {
  let foundUser = await User.findById(req.params.userId);
  res.json(foundUser);
};

exports.getUserTransactions = async (req, res) => {
  let userTransactions = await User.findById(req.params.userId).populate(
    "transactions"
  );
  res.json(userTransactions);
};
