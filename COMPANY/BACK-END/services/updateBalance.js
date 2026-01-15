const knex = require("../db/knex");
const { createTransaction } = require("../models/transactions.model");

exports.updateBalance = async (id, amount, trx) => {
  try {
    trx = trx || knex;
    if (!amount || isNaN(amount)) {
      // console.log(amount);
      throw new Error("Invalid amount", amount);
    }
    if (id) {
      await trx("Wallet")
        .where({ user_id: id })
        .increment("balance", amount) // Adds 'amount' to the current balance
        .update({ updated_at: knex.fn.now() }); // You can still update other fields

      await createTransaction({
        userId: id,
        amount,
        transactionType: "credit",
      });

      return { success: true };
    }
  } catch (err) {
    // console.error(err);
    return { success: false };
  }
};

exports.deductBalance = async ({ id, amount, trx }) => {
  try {
    trx = trx || knex;
    if (!amount || isNaN(amount)) {
      // console.log("error in Amount");
      // return { success: false };
      throw new Error("Invalid amount");
    }
    if (id) {
      const wallet = await trx("Wallet").where({ user_id: id }).first();
      if (!wallet || parseFloat(wallet.balance) < parseFloat(amount)) {
        console.log(wallet, id);
        return { success: false, error: "Insufficient balance" };
      }

      const deduct = await trx("Wallet")
        .where({ user_id: id })
        .decrement("balance", parseFloat(amount)) // Subtracts 'amount' from the current balance
        .update({ updated_at: knex.fn.now() }); // You can still update other fields
      // console.log("deduct ", deduct);
      await createTransaction({
        userId: id,
        amount,
        transactionType: "debit",
      });
      return { success: true };
    }
  } catch (err) {
    console.error(err);
    return { success: false };
  }
};
// Function to calculate and distribute revenue
exports.distributePickupRevenue = (totalAmount) => {
  return {
    userShare: totalAmount * 0.5, // 50%
    agentShare: totalAmount * 0.25, // 25%
    aggregatorShare: totalAmount * 0.2, // 20%
    wastebankShare: totalAmount * 0.05, // 5%
  };
};
