const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");
const catchErrors = require("../public/helpers/errorHandler");
const { body, check, validationResult } = require("express-validator");

router.get("/register", userController.registerForm);
router.post(
  "/register",
  [
    body("name", "You must provide a name!").not().isEmpty(),
    body("email", "That Email is not valid").isEmail().normalizeEmail({
      remove_dots: false,
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
  ],
  userController.validateRegister,
  catchErrors(userController.register)
);
router.get("/login", userController.loginForm);
router.get("/login");

router.get("/users:userId", catchErrors(userController.getUserById));
router.get("/users/:userId", catchErrors(userController.getUserTransactions));

router.get(
  "/transactions/:userId",
  transactionController.renderTransactionForm
);
router.post(
  "/transactions/:userId",
  catchErrors(transactionController.insertUserTransaction)
);

module.exports = router;
