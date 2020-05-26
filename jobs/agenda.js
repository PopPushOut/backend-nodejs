const Agenda = require("agenda");
const { connectionString } = require("../config");

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
    console.log(job);
  }
);
agenda.define(
  "International transactions with priority of [0-5] processing",
  { priority: 10 },
  async (job) => {
    const transactionsToProcess = await Transaction.getTransactionIds(
      "international"
    );
  }
);
agenda.define(
  "Domestic transactions with priority of [6-10] processing",
  { priority: 5 },
  async (job) => {
    const transactionsToProcess = await Transaction.getTransactionIds(
      "domestic"
    );
  }
);
agenda.define(
  "International transactions with priority of [6-10] processing",
  { priority: 0 },
  async (job) => {}
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
