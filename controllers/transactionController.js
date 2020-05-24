const Transaction = require("../models/Transaction");

exports.transactionForm = (req, res) => {
  res.render("transaction", {
    title: "Send Virtual Coins",
  });
};

exports.getUserTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId);
  res.json(transaction);
};
exports.updateUserTransaction = async (req, res) => {
  console.log("UPDATE" + req.params.transactionId);
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: req.params.transactionId },
    {
      transfer_amount: req.body.transfer_amount,
      receiver: req.body.receiver,
    },
    {
      new: true,
    }
  );
  res.json(updatedTransaction);
};
exports.insertUserTransactions = async (req, res) => {
  let transactions = req.body;
  if (transactions.length > 0) {
    transactions.map((t) => (t.user = req.user._id));
  }
  const insertedTransactions = await Transaction.insertMany(transactions);
  res.json(insertedTransactions);
};
// exports.insertUserTransaction = async (req, res) => {
//   const newTransaction = new Transaction({
//     ...req.body,
//     user: req.user._id,
//   });
//   const insertedTransaction = await newTransaction.save();
//   res.json(insertedTransaction);
// };
