//// menu.js (REVISI)

const menuGrid = document.getElementById("menuGrid");
const categoryList = document.getElementById("categoryList");
const cartBadge = document.getElementById("cartBadge");

let allMenu = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartBadge() {
    cartBadge.textContent = cart.length;
}

updateCartBadge();

function renderMenuItem(item) {
    const card = document.createElement("div");
    card.className = "menu-card";

    const imageUrl = item.imageURL || "placeholder.jpg";

    card.innerHTML = `
        <img src="${imageUrl}" class="menu-image" alt="${item.name}">
        <div class="card-body">
            <h3 class="menu-title">${item.name}</h3>
            <p class="menu-category">${item.category}</p>

            <div class="price-row">
                <span class="menu-price">Rp ${item.price}</span>
                <button class="add-btn">Tambah</button>
            </div>
        </div>
    `;

    card.querySelector(".add-btn").addEventListener("click", () => {
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge();
    });

    return card;
}

function renderCategories() {
    const categories = [...new Set(allMenu.map(i => i.category))];

    categoryList.innerHTML = "";

    const allBtn = document.createElement("div");
    allBtn.className = "category-item active";
    allBtn.textContent = "Semua Menu";

    allBtn.addEventListener("click", () => {
        document.querySelectorAll(".category-item").forEach(c => c.classList.remove("active"));
        allBtn.classList.add("active");
        displayMenu(allMenu);
    });

    categoryList.appendChild(allBtn);

    categories.forEach(cat => {
        const el = document.createElement("div");
        el.className = "category-item";
        el.textContent = cat;

        el.addEventListener("click", () => {
            document.querySelectorAll(".category-item").forEach(c => c.classList.remove("active"));
            el.classList.add("active");
            displayMenu(allMenu.filter(m => m.category === cat));
        });

        categoryList.appendChild(el);
    });
}

function displayMenu(data) {
    menuGrid.innerHTML = "";

    if (data.length === 0) {
        menuGrid.innerHTML = `<p class="loading-spinner">Tidak ada menu ditemukan.</p>`;
        return;
    }

    data.forEach(item => menuGrid.appendChild(renderMenuItem(item)));
}

async function loadMenu() {
    try {
        const res = await fetch("http://localhost:4000/api/menu");
        allMenu = await res.json();

        renderCategories();
        displayMenu(allMenu);
    } catch (err) {
        menuGrid.innerHTML = `<p class="loading-spinner">Gagal memuat menu...</p>`;
    }
}

loadMenu();
