require("dotenv").config();
const mongoose = require("mongoose");
const Menu = require("./models/Menu");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected (Seeding)");

    await Menu.deleteMany();

    const data = [
      { name: "Mie Pangsit", category: "Mie Pangsit Ayam", price: 15000 },
      { name: "Mie Pangsit Bakso", category: "Mie Pangsit Ayam", price: 17000 },
      { name: "Mie Pangsit Rebus", category: "Mie Pangsit Ayam", price: 17000 },
      { name: "Mie Pangsit Komplit", category: "Mie Pangsit Ayam", price: 19000 },

      { name: "Mie Ayam", category: "Mie Ayam", price: 15000 },
      { name: "Mie Ayam Bakso", category: "Mie Ayam", price: 17000 },
      { name: "Mie Ayam Komplit", category: "Mie Ayam", price: 17000 },

      { name: "Mie Yamin", category: "Mie Yamin", price: 16000 },
      { name: "Mie Yamin Komplit", category: "Mie Yamin", price: 19000 },

      { name: "Ayam Goreng", category: "Penyetan", price: 15000 },
      { name: "Ayam Bakar", category: "Penyetan", price: 15000 },
      { name: "Bakwan Goreng", category: "Penyetan", price: 15000 },
      { name: "Paket 4T", category: "Penyetan", price: 14000 }
    ];

    await Menu.insertMany(data);
    console.log("✅ Semua menu berhasil dimasukkan");
    process.exit();
  })
  .catch(err => console.error(err));