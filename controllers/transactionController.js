const Transaction = require("../models/Transaction");

const renderTransactionForm = (req, res) => {
  res.render("addTransaction", {
    title: "Add Transaction For User",
    userId: req.params.userId,
  });
};

const insertUserTransaction = async (req, res) => {
  console.log(req.params.userId);
  let newTransaction = new Transaction({
    ...req.body,
    user: req.params.userId,
  });
  console.log(newTransaction);
  let insertedTransaction = await newTransaction.save();
  res.json(insertedTransaction);
};

module.exports = {
  renderTransactionForm,
  insertUserTransaction,
};
