const Transaction = require("../models/Transaction");

exports.transactionForm = (req, res) => {
  res.render("transaction", {
    title: "Send Virtual Coins",
  });
};

exports.insertUserTransaction = async (req, res) => {
  const newTransaction = new Transaction({
    ...req.body,
    user: req.user._id,
  });
  const insertedTransaction = await newTransaction.save();
  res.json(insertedTransaction);
};
