const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Register berhasil ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN + JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User tidak ditemukan" });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    // buat token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil ✅",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
