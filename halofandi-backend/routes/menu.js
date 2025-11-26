const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const auth = require("../middleware/auth");

// ✅ CREATE MENU
router.post("/", auth, async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL MENU
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE MENU
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE MENU
router.delete("/:id", auth, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;