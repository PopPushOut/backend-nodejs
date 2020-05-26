const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.transactionForm = (req, res) => {
  res.render("transaction", {
    title: "Send Virtual Coins",
  });
};
exports.getUserTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId);
  res.json(transaction);
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

exports.updateUserTransaction = async (req, res) => {
  if (req.body.receiver) {
    await User.findById(req.body.receiver);
  }
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: req.params.transactionId, state: { $in: ["New"] } },
    {
      ...req.body,
    },
    {
      new: true,
    }
  );
  res.json(updatedTransaction);
};
exports.insertUserTransactions = async (req, res, next) => {
  let transactions = req.body;
  if (typeof req.body === "object" && !req.body.length) {
    transactions = [req.body];
  }
  if (transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      let found = await User.findById(transaction.receiver);
      if (!found) {
        return next(res.locals.createError(400));
      }
      transactions[i] = { ...transaction, sender: req.user._id };
    }
  }
  const insertedTransactions = await Transaction.insertMany(transactions);
  res.json(insertedTransactions);
};

exports.deleteUserTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.transactionId,
    state: { $in: ["New"] },
  });
  res.json(transaction);
};

exports.getTransactions = async (req, res, next) => {
  const transactionIdsToUpdate = await Transaction.getTransactionIds(
    "domestic",
    "high"
  );
  if (transactionIdsToUpdate.length === 0) {
    return next(res.locals.createError(400));
  }
  const result = await Transaction.updateMany(
    { _id: { $in: transactionIdsToUpdate[0].array } },
    { $set: { state: "Completed" } }
  );
  console.log(
    `num of docs matched ${result.n}, num of docs updated ${result.nModified}`
  );
  res.json(transactionIdsToUpdate);
};
