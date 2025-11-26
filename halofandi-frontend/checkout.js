//// checkout.js (REVISI TOTAL)

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const checkoutItems = document.getElementById("checkoutItems");
const checkoutSummary = document.getElementById("checkoutSummary");

// Ambil userId dari JWT
function getUserId() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;   // sesuaikan kalau backend pakai "userId" atau "_id"
}

// ------------------ Render Items ------------------
function renderItems() {
    checkoutItems.innerHTML = `<h2>Pesanan Anda</h2>`;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "checkout-item";

        div.innerHTML = `
            <span class="checkout-item-name">${item.name}</span>
            <span class="checkout-item-price">Rp ${item.price}</span>
            <button class="remove-item-btn">Hapus</button>
        `;

        div.querySelector(".remove-item-btn").addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCheckout();
        });

        checkoutItems.appendChild(div);
    });
}

// ------------------ Render Summary ------------------
function renderSummary() {
    const total = cart.reduce((a, b) => a + b.price, 0);

    checkoutSummary.innerHTML = `
        <h3>Ringkasan</h3>

        <div class="checkout-total-row">
            <span>Total</span>
            <span>Rp ${total}</span>
        </div>

        <div class="payment-methods">
            <h4>Metode Pembayaran</h4>

            <label class="payment-option">
                <input type="radio" name="pay" value="transfer" checked>
                <span>Transfer Bank</span>
            </label>

            <label class="payment-option">
                <input type="radio" name="pay" value="qris">
                <span>QRIS</span>
            </label>
        </div>

        <button id="checkoutBtn" class="checkout-btn">Buat Pesanan</button>
    `;

    document.getElementById("checkoutBtn").addEventListener("click", submitOrder);
}

// ------------------ Submit Order to Backend ------------------
async function submitOrder() {
    if (cart.length === 0) return alert("Keranjang kosong!");

    const userId = getUserId();
    if (!userId) return alert("Anda belum login!");

    const paymentMethod = document.querySelector("input[name='pay']:checked").value;

    const orderBody = {
        user: userId,
        items: cart,
        totalPrice: cart.reduce((a, b) => a + b.price, 0),
        status: "Diproses"
    };

    try {
        const res = await fetch("http://localhost:4000/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(orderBody)
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message || "Gagal membuat pesanan");

        // Clear cart
        localStorage.removeItem("cart");

        // Redirect by payment method
        if (paymentMethod === "qris") {
            window.location.href = `payment-qris.html?total=${orderBody.totalPrice}&orderId=${data._id}`;
        } else {
            alert("Pesanan berhasil dibuat!");
            window.location.href = "menu.html";
        }

    } catch (error) {
        console.error(error);
        alert("Gagal terhubung ke server");
    }
}

// ------------------ Load ------------------
function loadCheckout() {
    renderItems();
    renderSummary();
}

loadCheckout();
