const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController");
const catchErrors = require("../public/helpers/errorHandler");

/// register routes //
router.get("/register", userController.registerForm);
router.post(
  "/register",
  userController.registerFormValidators(),
  catchErrors(userController.register),
  authController.login
);

/// login routes ///
router.get("/login", userController.login);
router.post("/login", authController.login);

// transaction routes ///
router.get("/transaction", transactionController.transactionForm);

router.get(
  "/transactions",
  authController.jwtAuth,
  catchErrors(userController.getUserTransactions)
);
router.get(
  "/transactions/:transactionId",
  authController.jwtAuth,
  catchErrors(transactionController.getUserTransaction)
);
router.post(
  "/transactions",
  authController.jwtAuth,
  catchErrors(transactionController.insertUserTransactions)
);
router.put(
  "/transactions/:transactionId",
  authController.jwtAuth,
  catchErrors(transactionController.updateUserTransaction)
);
router.delete(
  "/users/:userId/transactions/:transactionId",
  authController.jwtAuth
  // delete single transaction
);
router.delete(
  "/users/:userId/transactions/:transactionIds",
  authController.jwtAuth
  // delete multiple transactions
);

module.exports = router;
