require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/order");

const app = express();

// CORS FIX — hanya 1 kali
app.use(
  cors({
    origin: "http://localhost:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("HaloFandi Backend Running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
