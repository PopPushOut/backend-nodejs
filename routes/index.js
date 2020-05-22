const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");
const catchErrors = require("../public/helpers/errorHandler");

router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.registerFormValidators(),
  catchErrors(userController.register),
  authController.login
);
router.post("/login", authController.login);
router.get("/login", userController.login);

//router.get("/users:userId", catchErrors(userController.getUserById));
router.get(
  "/transactions",
  authController.jwtAuth,
  catchErrors(userController.getUserTransactions)
);

router.get("/transaction", transactionController.transactionForm);
router.post(
  "/transaction",
  authController.jwtAuth,
  catchErrors(transactionController.insertUserTransaction)
);

module.exports = router;
