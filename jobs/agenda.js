const Agenda = require("agenda");
const { connectionString } = require("../config");
const Transaction = require("../models/Transaction");

const agenda = new Agenda({
  db: {
    address: connectionString,
    collection: "jobs",
    options: { ssl: true, useUnifiedTopology: true },
  },
});

//Job1 - Transactions from users with prio [0-5] and same account/nationality (e.g LT-LT)
//Job2 - Transactions from users with prio [0-5] and different account/nationality
//Job3 - Transactions from users with prio [6-10] and same account/nationality (e.g LT-LT)
//Job4 - Transactions from users with prio [6-10] and different account/nationality

agenda.define(
  "Domestic transactions with priority of [0-5] processing",
  { priority: 20 },
  async (job) => {
    const transactionIdsToUpdate = await Transaction.getTransactionIds(
      "domestic",
      "high"
    );
    if (transactionIdsToUpdate.length === 0) {
      //nothing to update
      return;
    }
    const result = await Transaction.processMultipleTransactions(
      transactionIdsToUpdate[0].array
    );
    console.log(
      `num of docs matched ${result.n}, num of docs updated ${result.nModified}`
    );
  }
);
agenda.define(
  "International transactions with priority of [0-5] processing",
  { priority: 10 },
  async (job) => {
    const transactionIdsToUpdate = await Transaction.getTransactionIds(
      "international",
      "high"
    );
    if (transactionIdsToUpdate.length === 0) {
      //nothing to update
      return;
    }
    const result = await Transaction.processMultipleTransactions(
      transactionIdsToUpdate[0].array
    );
  }
);
agenda.define(
  "Domestic transactions with priority of [6-10] processing",
  { priority: 5 },
  async (job) => {
    const transactionIdsToUpdate = await Transaction.getTransactionIds(
      "domestic",
      "low"
    );
    if (transactionIdsToUpdate.length === 0) {
      //nothing to update
      return;
    }
    const result = await Transaction.processMultipleTransactions(
      transactionIdsToUpdate[0].array
    );
  }
);
agenda.define(
  "International transactions with priority of [6-10] processing",
  { priority: 0 },
  async (job) => {
    const transactionIdsToUpdate = await Transaction.getTransactionIds(
      "international",
      "low"
    );
    if (transactionIdsToUpdate.length === 0) {
      //nothing to update
      return;
    }
    const result = await Transaction.processMultipleTransactions(
      transactionIdsToUpdate[0].array
    );
  }
);

(async function () {
  await agenda.start();

  await agenda.every("15 minutes", [
    "Domestic transactions with priority of [0-5] processing",
    "International transactions with priority of [0-5] processing",
  ]);

  await agenda.every("1 hour", [
    "Domestic transactions with priority of [6-10] processing",
    "International transactions with priority of [6-10] processing",
  ]);
})();
module.exports = agenda;
