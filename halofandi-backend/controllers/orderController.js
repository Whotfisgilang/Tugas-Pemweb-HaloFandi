const Order = require("../models/Order");
const Menu = require("../models/Menu");

// ===============================
// CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items tidak boleh kosong" });
    }

    let total = 0;

    // Hitung total harga
    for (let item of items) {
      const menu = await Menu.findById(item.menu);
      if (!menu) {
        return res.status(404).json({ message: `Menu dengan id ${item.menu} tidak ditemukan` });
      }
      total += menu.price * item.qty;
    }

    // Simpan order baru
    const newOrder = await Order.create({
      user: req.user.id,
      items,
      totalPrice: total
    });

    res.status(201).json({
      message: "Order berhasil dibuat",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// GET ORDER HISTORY USER
// ===============================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.menu")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ADMIN → GET SEMUA ORDER
// ===============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menu");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
