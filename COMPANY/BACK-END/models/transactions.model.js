const knex = require("../db/knex");

const addTransactionModel = async ({ userId, amount, transactionType }) => {
  try {
    const transaction = await knex("transactions")
      .insert({
        user_id: userId,
        amount,
        type: transactionType,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
      .returning("*");
    return { success: true, transaction };
  } catch (err) {
    console.log("ERROR FOUND :", err);
    return { success: false, error: "Unauthorized" };
  }
};

const fetchTransactions = async (userId) => {
  try {
    const transactions = await knex("transactions")
      .where({ user_id: userId })
      .select("*");
    return { success: true, transactions };
  } catch (err) {
    return { success: false, error: "Unauthorized" };
  }
};

module.exports = { createTransaction: addTransactionModel, fetchTransactions };
