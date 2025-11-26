const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Menu = require("../models/Menu");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;

    let total = 0;

    for (let item of items) {
      const menu = await Menu.findById(item.menu);
      if (!menu) return res.status(404).json({ message: "Menu tidak ditemukan" });
      total += menu.price * item.qty;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice: total,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ GET ORDER HISTORY USER (WAJIB TOKEN)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.menu")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ ADMIN / DEBUG → GET SEMUA ORDER
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menu");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
