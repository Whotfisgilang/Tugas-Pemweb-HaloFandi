const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Menu = require("../models/Menu");

// 📌 CREATE ORDER (tanpa token)
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items tidak boleh kosong" });
    }

    let total = 0;

    for (let item of items) {
      const menu = await Menu.findById(item.menu);
      if (!menu) {
        return res.status(404).json({ message: `Menu ${item.menu} tidak ditemukan` });
      }
      total += menu.price * item.qty;
    }

    const order = await Order.create({
      items,
      totalPrice: total,
      status: "waiting",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📌 GET ALL — untuk admin
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menu");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
