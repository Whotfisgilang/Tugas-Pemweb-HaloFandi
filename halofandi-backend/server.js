require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const menuRoutes = require("./routes/menu"); // ✅ CUKUP SATU KALI SAJA
const orderRoutes = require("./routes/order");


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use(cors({
    origin: 'http://localhost:5500', // Ganti 3000 dengan port frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.get("/", (req, res) => {
  res.send("HaloFandi Backend Running ✅");
});

// ✅ Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
