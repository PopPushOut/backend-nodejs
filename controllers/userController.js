const User = require("../models/User");
const { body, check, validationResult } = require("express-validator");

exports.registerFormValidators = () => {
  return [
    body("name", "You must provide a name!").not().isEmpty(),
    body("email", "That Email is not valid").isEmail().normalizeEmail({
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false,
    }),
    body("password", "Password Cannot be empty!").not().isEmpty(),
    body("password-confirm", "Confirmed Password cannot be blank")
      .not()
      .isEmpty(),
    check("password-confirm", "Oops! Your passwords do not match").custom(
      (value, { req }) => value === req.body.password
    ),
  ];
};

exports.registerForm = (req, res) => {
  res.render("register", { title: "Register", body: "" });
};

exports.register = async (req, res, next) => {
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
      body: req.body,
    });
    return;
  }
  const user = new User({
    ...req.body,
    importance: 5,
  });
  let insertedUser = await User.register(user, req.body.password);
  next();
};
exports.login = (req, res) => {
  res.render("login", { title: "Login", body: "" });
};

exports.getUserById = async (req, res) => {
  let foundUser = await User.findById(req.params.userId);
  res.json(foundUser);
};

exports.getUserTransactions = async (req, res, next) => {
  let query = {};
  if (Object.keys(req.query).length > 0) {
    const {
      created_after,
      created_before,
      created_between,
      ...rest_query
    } = req.query;
    let qs = new res.locals.qs();
    if (created_between) {
      qs.customBetween("created")(query, created_between);
    } else if (created_after) {
      qs.customAfter("created")(query, created_after);
    } else if (created_before) {
      qs.customBefore("created")(query, created_before);
    }
    Object.assign(query, qs.parse(rest_query));
  }

  let user = await User.findById(req.user._id).populate({
    path: "transactions",
    match: query,
  });
  res.json(user.transactions);
};
