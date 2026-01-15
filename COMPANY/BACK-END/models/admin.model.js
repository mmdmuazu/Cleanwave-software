const knex = require("../db/knex");
const getAllUsers = async () => {
  try {
    const allUsers = await knex("Users")
      .where({ role: "user" })
      .leftJoin("Wallet", "Wallet.user_id", "Users.id")
      .select(
        "Users.id",
        "Users.name",
        "Users.email",
        "Users.gender",
        "Users.phone",
        "Users.state",
        "Users.lga",
        "Users.is_verified",
        "Users.created_at",
        "Users.updated_at",
        "Wallet.balance"
      );
    return { success: true, allUsers };
  } catch (err) {
    // console.log("Error in admin.models :", err);
    return { success: false, error: "Server Error" };
  }
};

module.exports = { getAllUsers };
