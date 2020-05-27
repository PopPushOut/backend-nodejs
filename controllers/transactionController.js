const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.transactionForm = (req, res) => {
  res.render("transaction", {
    title: "Send Virtual Coins",
  });
};
exports.getUserTransaction = async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.transactionId);
  if (!transaction) {
    return next(
      res.locals.createError(404, "No user transaction with given ID found!")
    );
  }
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
  const user = await User.findById(req.user._id).populate({
    path: "transactions",
    match: query,
  });
  if (!user.transactions.length) {
    return next(
      res.locals.createError(404, "No transactions with associated user found!")
    );
  }
  res.json(user.transactions);
};

exports.updateUserTransaction = async (req, res, next) => {
  if (req.body.receiver) {
    await User.findById(req.body.receiver);
  }
  const updatedTransaction = await Transaction.findOneAndUpdate(
    {
      _id: req.params.transactionId,
      sender: req.user._id,
      state: { $in: ["Pending"] },
    },
    {
      ...req.body,
    },
    {
      new: true,
    }
  );
  if (!updatedTransaction) {
    return next(
      res.locals.createError(
        404,
        "Nothing was updated, values of item in db could be the same!"
      )
    );
  }
  res.json(updatedTransaction);
};
exports.insertUserTransactions = async (req, res, next) => {
  const regex = /^\d+(?:\.\d{0,2})$/; // to validate price format

  let transactions = req.body;
  if (typeof req.body === "object" && !req.body.length) {
    transactions = [req.body];
  }
  if (transactions.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      let found = await User.findById(transaction.receiver);

      if (!found || !regex.test(transaction.transfer_amount)) {
        return next(res.locals.createError(400));
      }
      transactions[i] = { ...transaction, sender: req.user._id };
    }
  }
  const insertedTransactions = await Transaction.insertMany(transactions);
  res.json(insertedTransactions);
};

exports.deleteUserTransaction = async (req, res, next) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.transactionId,
    sender: req.user._id,
    state: { $in: ["Pending"] },
  });
  if (!transaction) {
    return next(
      res.locals.createError(
        404,
        "Nothing was deleted, check if the item you are trying to delete exists!"
      )
    );
  }
  res.json(transaction);
};
