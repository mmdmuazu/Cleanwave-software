const knex = require("../db/knex");
const { getAllUsers } = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { updateBalance } = require("../services/updateBalance");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("AdminLogin:: This is request Body :", req.body);
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const admin = await knex("admin").where({ email }).first();
    if (!admin) {
      return res.status(403).json({ error: "Invalid credentials" });
    }
    // const valid = await bcrypt.compare(password, admin.password);
    if (admin.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("adminControolers:: Password: ", password, admin);
    // if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { adminId: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // res.clearCookie("AuthToken");
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      success: true,
      token: token,
      role: admin.role,
      redirect: "/dashboard",
    });
  } catch (err) {
    console.log("AdminLogin:: ERROR", err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
const adminCheckLogin = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    // console.log("checkLogin:: ", token);
    if (!token) {
      return res
        .status(406)
        .json({ success: false, error: "no token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, error: "Invalid Token" });
      }
      if (decoded) {
        return res.status(200).json({ success: true, role: decoded.role });
      }
    });
  } catch (err) {
    console.log("adminCheckLogin:: ERROR", err);
    return res.status(403).json({ success: false, error: "Unauthorized" });
  }
};
const adminLogout = (req, res) => {
  // No need for req.body.role check
  // Clear the single, constant cookie name
  res.clearCookie("authToken", {
    httpOnly: true,
    // Use the same secure/sameSite settings as the login function
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Use strict or none depending on cross-site needs
  });

  return res.json({
    success: false,
    message: "Logged out successfully", // Generic message
  });
};

const getAllInfo = async (req, res) => {
  try {
    // ===== Counts =====
    const waste = await knex("Users")
      .where({ role: "waste" })
      .count("* as count");
    const agents = await knex("Users")
      .where({ role: "agent" })
      .count("* as count");
    const aggregators = await knex("Users")
      .where({ role: "aggregator" })
      .count("* as count");

    // Gender counts
    const maleRes = await knex("Users")
      .whereRaw("LOWER(coalesce(gender,'')) = 'male'")
      .count("id as total");

    const femaleRes = await knex("Users")
      .whereRaw("LOWER(coalesce(gender,'')) = 'female'")
      .count("id as total");

    // ===== Parse Values =====
    const stats = {
      users: {
        male: parseInt(maleRes[0].total, 10),
        female: parseInt(femaleRes[0].total, 10),
        total:
          parseInt(maleRes[0].total, 10) + parseInt(femaleRes[0].total, 10),
      },
      overview: {
        wasteBanks: parseInt(waste[0].count, 10),
        agents: parseInt(agents[0].count, 10),
        aggregators: parseInt(aggregators[0].count, 10),
      },
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("AdminDashboard:: Error ", err);
    return res.status(403).json({
      success: false,
      error: err.message || "Unauthorized",
    });
  }
};

const totalUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users.success) {
      return res.status(200).json(users);
    } else {
      return res.status(400).json({ error: users });
    }
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      phone,
      password,
      gender,
      state,
      lga,
      is_verified,
    } = req.body;
    console.log("adminControllers:: This is request Body :", req.body);
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const existinUser = await knex("Users").where({ email }).first();
    console.log("adminControllers:: Existing User :", existinUser);
    if (!existinUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await knex("Users")
      .where({ email })
      .update({
        name: name || existinUser.name,
        email: email || existinUser.email,
        phone: phone || existinUser.phone,
        age: age || existinUser.age,
        password: hashedPassword || existinUser.password,
        gender: gender || existinUser.gender,
        state: state || existinUser.state,
        lga: lga || existinUser.lga,
        is_verified: is_verified,
        updated_at: knex.fn.now(),
      });

    return res.status(200).json({ success: true, message: "Profile updated" });
  } catch (err) {
    console.log("adminControllers:: ERROR", err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

const getWasteData = async (req, res) => {
  try {
    const data = await knex("Waste_pickups").select("*");
    if (!data) {
      return res.status(201).json({ message: "No pickups Found" });
    }
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};
const updateWasteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "All Fields Are required!" });
  }

  try {
    // 1. Use a transaction for financial integrity
    await knex.transaction(async (trx) => {
      // 2. Fetch the current state first to prevent double-payout
      const existingPickup = await trx("Waste_pickups").where({ id }).first();

      if (!existingPickup) {
        throw new Error("NOT_FOUND");
      }

      // 3. Only process payout if the status is CHANGING to 'delivered'
      if (status === "delivered" && existingPickup.status !== "delivered") {
        const category = await trx("Categories")
          .where({ name: existingPickup.category })
          .first();

        if (!category) throw new Error("CATEGORY_NOT_FOUND");

        let pricePerKg = parseFloat(category.prize_per_kg) || 0;
        console.log("category price :", pricePerKg, category.prize_per_kg);

        if (existingPickup.subcategory) {
          const sub = await trx("Sub_Categories")
            .where({ name: existingPickup.subcategory })
            .first();
          pricePerKg = parseFloat(sub.prize_per_kg) || 0;
        }

        // 4. Calculate payout (Rounding to avoid floating point issues)
        const kg = parseFloat(existingPickup.kg) || 0;
        const payout = Math.round(pricePerKg * kg);
        console.log("Payout calculated :", payout);

        // 5. Update user balance within the same transaction
        const user = await knex("Users")
          .where({ id: existingPickup.user_id })
          .first();
        const aggregator =
          (await knex("Users").where({ id: user.created_by }).first()) || null;
        if (!aggregator) {
          throw new Error("aggregator not Found");
        }
        await updateBalance(aggregator.id, payout, trx);
        await updateBalance(existingPickup.user_id, payout, trx);
      }

      // 6. Update the pickup status
      console.log("Existing Pickup Kg", existingPickup.kg);
      await knex("Users")
        .where({ id: existingPickup.user_id })
        .decrement("capacity", existingPickup.kg);
      await trx("Waste_pickups").where({ id }).update({ status });
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "No Pickups Found" });
    }
    console.error("Transaction Error:", err);
    return res.status(403).json({ error: "Unuthorized" });
  }
};

// const updateWasteStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!id || !status) {
//       return res.status(400).json({ error: "All Fields Are required!" });
//     }

//     const pickup = await knex("Waste_pickups")
//       .where({ id })
//       .update({ status })
//       .returning("*");
//     console.log("Pick8 :", pickup[0]);
//     if (!pickup) {
//       return res.status(404).json({ error: "No Pickups Found" });
//     }
//     if (status == "delivered" && pickup[0].status == "delivered") {
//       let pricePerKg = 0;
//       if (pickup[0].subcategory) {
//         const subcategory = pickup[0].subcategory;
//         const sub = await knex("Sub_Categories")
//           .where({ name: subcategory })
//           .first();
//         pricePerKg = parseFloat(sub.price_per_kg);
//         console.log("sub,", sub);
//       }
//       const payout = Math.round(pricePerKg * parseFloat(pickup[0].kg));
//       console.log(pricePerKg);
//       await updateBalance(pickup[0].user_id, payout);

//       return res.status(200).json({ success: true });
//     } else {
//       return res.status(400).json({ error: "Pickup not founds" });
//     }
//   } catch (err) {
//     console.log("Error :", err);
//     return res.status(403).json({ error: "Unuthorized" });
//   }
// };
module.exports = {
  totalUsers,
  getAllInfo,
  adminLogin,
  updateProfile,
  adminLogout,
  adminCheckLogin,
  getWasteData,
  updateWasteStatus,
};
