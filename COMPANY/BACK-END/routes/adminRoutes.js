const express = require("express");
const router = express.Router();
const { isAdmin } = require("../utils/isAdmin");
const {
  getAllInfo,
  totalUsers,
  adminLogin,
  updateProfile,
  adminLogout,
  adminCheckLogin,
  getWasteData,
  updateWasteStatus,
} = require("../controllers/adminControllers");
const { authenticate } = require("../controllers/authControllers");

router.post("/login", adminLogin);
router.post("/logout", isAdmin, adminLogout);
router.get("/check-login", adminCheckLogin);
router.get("/all-info", isAdmin, getAllInfo);
router.get("/total-users", isAdmin, totalUsers);
router.put("/update-profile", isAdmin, updateProfile);
router.get("/waste-data", authenticate, getWasteData);
router.put("/waste-status/:id", isAdmin, updateWasteStatus);
module.exports = router;
