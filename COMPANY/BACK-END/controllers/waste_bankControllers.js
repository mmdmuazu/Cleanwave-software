const knex = require("../db/knex");
const {
  registerWasteBank,
  getWasteBanksModel,
  getAllWasteBanks,
} = require("../models/waste.model");
const bcrypt = require("bcryptjs");
const addWasteBank = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log(userId);
    const { name, password, email, phone, gender } = req.body;
    console.log("wasteContro::", req.body);
    if (!userId || !name || !password || !email || !phone || !gender) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const wasteBank = await registerWasteBank({
      aggregatorId: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
    });
    if (wasteBank.success) {
      return res.status(200).json(wasteBank);
    } else {
      return res.status(400).json({ error: wasteBank.error });
    }
  } catch (err) {
    console.log("error in waste bank controllers file ", err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
//====================================
// Get Waste Banks Profile - Aggregator
//====================================
const getWasteBanks = async (req, res) => {
  try {
    const { userId } = req.user;
    const aggregatorId = userId;
    const wasteBanks = await getWasteBanksModel(aggregatorId);
    if (wasteBanks.success) {
      return res.status(200).json({ wasteBanks });
    } else {
      console.log("wasteBankController:: ERROR", wasteBanks);
      return res.status(400).json({ error: "No Waste Banks Found" });
    }
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

//====================================
// Get All Waste Banks Profile - Admin
//====================================
const getAll = async (req, res) => {
  try {
    const allWasteBanks = await getAllWasteBanks();
    if (allWasteBanks.success) {
      return res.status(200).json({ allWasteBanks });
    } else {
      console.log("WasteController allwasteBanks ", allWasteBanks);
      return res.status(400).json({ error: "No Waste Banks Found" });
    }
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

const getConnWasteBank = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("authControler :: getConn: ", req.user);
    const agent = await knex("Users").where({ id: userId }).first();
    if (agent) {
      const conWasteBanks = await knex("Users")
        .where({
          role: "waste",
          state: agent.state,
          lga: agent.lga,
        })
        .count("* as count")
        .first();
      if (conWasteBanks) {
        return res.status(200).json({ conWasteBanks });
      }
      return res.status(400).json({ error: "No waste banks found" });
    }
    return res.status(400).json({ error: "Invelid request" });
  } catch (err) {
    console.log("wasteBankController :: getConnWasteBank ERROR", err);
    return res.status(403).json({ error: "Unauthorized " });
  }
};

module.exports = { addWasteBank, getWasteBanks, getAll, getConnWasteBank };
