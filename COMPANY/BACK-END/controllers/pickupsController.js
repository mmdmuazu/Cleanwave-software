const knex = require("../db/knex");
const {
  createPickup,
  getPickupCount,
  createWastePickup,
} = require("../models/pickups.model");
const {
  updateBalance,
  distributePickupRevenue,
} = require("../services/updateBalance");

/**
 * Utility for unified responses
 */
const sendResponse = (res, status, data) => res.status(status).json(data);
const sendError = (res, status, message) =>
  res.status(status).json({ error: message });

/**
 *  Get pickup statistics for a user
 */
exports.getPickupCountRequests = async (req, res) => {
  try {
    const { userId } = req.user;
    const stats = await getPickupCount(userId);
    return sendResponse(res, 200, { success: true, data: stats });
  } catch (err) {
    console.error(`[Stats Error]: ${err.message}`);
    return sendError(res, 403, "Failed to fetch pickup statistics");
  }
};

/**
 *  Create a specific pickup request assigned to an agent
 */
exports.createPickupRequest = async (req, res) => {
  try {
    const { category, agent, subcategory, kg, address } = req.body;
    const { userId } = req.user;

    if (!agent || !kg || !category || !address) {
      return sendError(res, 400, "Missing required fields");
    }

    const result = await createPickup({
      userId,
      agentId: agent,
      kg,
      category,
      subcategory,
      address,
    });

    if (!result.success) return sendError(res, 400, result.error);

    return sendResponse(res, 201, { success: true, message: result.message });
  } catch (err) {
    console.error(`[CreatePickup Error]: ${err.message}`);
    return sendError(res, 403, "Unauthorized");
  }
};
exports.wastePickupRequest = async (req, res) => {
  try {
    const { category, subcategory, kg, note } = req.body;
    const userId = req.user.userId;

    if (!userId || !kg || !category) {
      return sendError(res, 400, "All fields are required");
    }
    const user = await knex("Users").where({ id: userId }).first();
    if (!user) {
      return sendError(res, 401, "Invalid Credentials");
    }
    if (Number(user.capacity) == 0 || kg > Number(user.capacity)) {
      return sendError(res, 401, "Cant make Pickups at the moment");
    }
    const pickup = await createWastePickup({
      userId,
      kg,
      category,
      subcategory,
      note,
    });

    if (pickup.success) {
      return sendResponse(res, 201, {
        success: true,
        data: pickup.message,
      });
    } else {
      return sendError(res, 400, pickup.error);
    }
  } catch (err) {
    console.error(`[WastePickup Error]: ${err.message}`);
    return sendError(res, 403, "Unauthorized");
  }
};

/**
 * @desc Fetch pickups by status for the logged-in agent
 */
const getAgentPickupsByStatus = (status) => async (req, res) => {
  try {
    const { userId } = req.user;
    // const pickups = await knex("Pickups")
    //   .where({ agent_id: userId, status })
    //   .orderBy("created_at", "desc");
    const pickups = await knex("Pickups")
      .where({ status }) // Filter by status first
      .andWhere(function () {
        this.where("agent_id", userId).orWhere("user_id", userId);
      })
      .orderBy("created_at", "desc");

    if (!pickups || pickups.length === 0) {
      return sendResponse(res, 200, {
        success: true,
        message: `No ${status} pickups found`,
        data: [],
      });
    }

    return sendResponse(res, 200, { success: true, data: pickups });
  } catch (err) {
    console.error(`[Fetch ${status} Error]: ${err.message}`);
    return sendError(res, 403, "Error retrieving pickup records");
  }
};

exports.getPendingPickups = getAgentPickupsByStatus("pending");
exports.getAcceptedPickups = getAgentPickupsByStatus("accepted");
exports.getDeliveredPickups = getAgentPickupsByStatus("delivered");

/**
 * @desc Update pickup status to accepted
 */
exports.acceptPickup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const updated = await knex("Pickups")
      .where({ id, agent_id: userId, status: "pending" })
      .update({
        status: "accepted",
        updated_at: knex.fn.now(),
      });

    if (!updated)
      return sendError(res, 404, "Pickup not found or already processed");

    return sendResponse(res, 200, {
      success: true,
      message: "Pickup accepted successfully",
    });
  } catch (err) {
    console.error(`[Accept Error]: ${err.message}`);
    return sendError(res, 403, "Failed to accept pickup");
  }
};

/**
 * @desc Finalize waste delivery, handle payments and inventory
 */

exports.wasteDelivered = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { agent, kg, category, subcategory } = req.body;
    const { userId } = req.user;

    if (!agent || !kg || !category) {
      await trx.rollback();
      return sendError(res, 400, "All verification fields are required");
    }

    // 1. Find the Pickup
    let pickupQuery = trx("Pickups").where({
      agent_id: agent,
      kg,
      category,
      status: "accepted",
    });

    if (subcategory) {
      pickupQuery = pickupQuery.andWhere({ subcategory });
    }
    const pickup = await pickupQuery.first();

    if (!pickup) {
      await trx.rollback();
      return sendError(res, 404, "No matching accepted pickup found");
    }

    // 2. Pricing Logic (Using your Sub_Categories logic)
    let pricePerKg = 0;

    if (subcategory) {
      const subCat = await trx("Sub_Categories")
        .where({
          name: subcategory,
          category_id: trx("Categories").select("id").where({ name: category }), // Use trx for consistency
        })
        .first();

      if (!subCat) {
        await trx.rollback();
        return sendError(res, 404, "Invalid waste sub-category");
      }
      pricePerKg = subCat.prize_per_kg;
    } else {
      const cat = await trx("Categories").where({ name: category }).first();
      if (!cat) {
        await trx.rollback();
        return sendError(res, 404, "Invalid waste category");
      }
      pricePerKg = cat.prize_per_kg;
    }

    // 3. Updates and Payouts
    // Update Verifier Capacity
    await trx("Users")
      .where({ id: userId })
      .increment("capacity", kg)
      .update({ updated_at: knex.fn.now() });

    // Update Pickup Status
    await trx("Pickups")
      .where({ id: pickup.id })
      .update({ status: "delivered", updated_at: knex.fn.now() });

    // Increment Total Waste in Main Category
    await trx("Categories")
      .where({ name: category })
      .increment("kg", kg)
      .update({ updated_at: knex.fn.now() });

    // Calculate Payout
    const payout = distributePickupRevenue(pricePerKg); //Math.round(pricePerKg * kg);

    const userPayout = Math.round(payout.userShare * kg);
    const agentPayout = Math.round(payout.agentShare * kg);
    // Update Balances
    await updateBalance(pickup.user_id, userPayout, trx);
    await updateBalance(agent, agentPayout, trx);

    await trx.commit();
    return sendResponse(res, 200, {
      success: true,
      message: "Delivery confirmed and payouts processed",
      data: { payout },
    });
  } catch (err) {
    await trx.rollback();
    console.error(`[Delivery Process Error]: ${err}`);
    return sendError(
      res,
      403,
      "Transactional error during delivery verification"
    );
  }
};

// exports.wasteDelivered = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { agent, kg, category, subcategory } = req.body;
//     const { userId } = req.user; // Verifier ID

//     if (!agent || !kg || !category) {
//       await trx.rollback();
//       return sendError(res, 400, "All verification fields are required");
//     }

//     let pickupQuery = trx("Pickups").where({
//       agent_id: agent,
//       kg,
//       category,
//       status: "accepted",
//     });

//     if (subcategory) {
//       console.log("Having subcategory for delivery verification");
//       pickupQuery = pickupQuery.andWhere({ subcategory });
//     } else {
//       console.log("No subcategory provided for delivery verification");
//       pickupQuery = pickupQuery.whereNull("subcategory");
//     }

//     const pickup = await pickupQuery.first();
//     console.log("Pickup found for verification:", req.body);

//     if (!pickup) {
//       await trx.rollback();
//       return sendError(
//         res,
//         404,
//         "No matching accepted pickup found for verification"
//       );
//     }
//     let pricePerKg = 0;
//     if (subcategory) {
//       const subCat = await trx("Sub_Categories")
//         .where({
//           name: subcategory,
//           category_id: knex("Categories")
//             .select("id")
//             .where({ name: category }),
//         })
//         .first();
//       if (!subCat) {
//         await trx.rollback();
//         return sendError(res, 404, "Invalid waste sub-category");
//       }
//       pricePerKg = subCat.prize_per_kg;
//     } else {
//       const cat = await trx("Categories").where({ name: category }).first();
//       if (!cat) {
//         await trx.rollback();
//         return sendError(res, 404, "Invalid waste category");
//       }
//       pricePerKg = cat.prize_per_kg;
//     }
//     // 2. Get Pricing logic
//     const cat = await trx("Categories").where({ name: category }).first();
//     if (!cat) {
//       await trx.rollback();
//       return sendError(res, 404, "Invalid waste category");
//     }

//     // Update verifier capacity and pickup status
//     await trx("Users")
//       .where({ id: userId })
//       .increment("capacity", kg)
//       .update({ updated_at: knex.fn.now() });

//     await trx("Pickups")
//       .where({ id: pickup.id })
//       .update({ status: "delivered", updated_at: knex.fn.now() });
//     await trx("Categories")
//       .where({ name: category })
//       .increment("kg", kg)
//       .update({ updated_at: knex.fn.now() });

//     const payout = Math.round(pricePerKg * kg);

//     // 3. Update financial and inventory records atomically
//     await updateBalance(pickup.user_id, payout, trx);
//     await updateBalance(agent, payout, trx);
//     await trx.commit();
//     return sendResponse(res, 200, {
//       success: true,
//       message: "Delivery confirmed and payouts processed",
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error(`[Delivery Process Error]: ${err}`);
//     return sendError(
//       res,
//       403,
//       "Transactional error during delivery verification"
//     );
//   }
// };
