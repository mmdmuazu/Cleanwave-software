const knex = require("../db/knex");

const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({ error: "All Fields are Requires!" });
    }

    // const wallet = await knex("Wallet").where({ user_id: userId }).first();
    const wallet = await knex("Wallet").where({ user_id: userId }).first();

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (err) {
    res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = {
  getWalletBalance,
};
