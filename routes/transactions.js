const express = require("express");
const router = express.Router();
const errorHandler = require("../public/helpers/errorHandler");
const UserTransaction = require("../models/TransactionModel");
/* GET users listing. */
router.get("/:userId", function (req, res) {
  res.render("addTransaction", {
    title: "Add Transaction",
    userId: req.params.userId,
  });
});
router.post(
  "/:userId",
  errorHandler(async (req, res) => {
    console.log(req.params.userId);
    let newTransaction = new UserTransaction({
      ...req.body,
      user: req.params.userId,
    });
    console.log(newTransaction);
    let insertedTransaction = await newTransaction.save();
    res.json(insertedTransaction);
  })
);

module.exports = router;
