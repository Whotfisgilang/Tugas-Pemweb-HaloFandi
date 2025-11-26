document.addEventListener("DOMContentLoaded", () => {
    loadCheckout();
    setupPaymentSelection();
});

let selectedPayment = null;

function setupPaymentSelection() {
    const radios = document.querySelectorAll("input[name='payment']");
    const payBtn = document.querySelector(".checkout-btn");

    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            selectedPayment = radio.value;

            // Aktifkan tombol bayar
            payBtn.classList.remove("disabled");
            payBtn.style.background = "#007aff";
            payBtn.disabled = false;
        });
    });
}

function loadCheckout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutSummary = document.getElementById("checkoutSummary");

    checkoutItems.innerHTML = "";
    checkoutSummary.innerHTML = "";

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div style="text-align:center; padding:40px; font-size:1.2rem; font-weight:600;">
                Anda belum menambahkan apapun ke keranjang.<br><br>
                <a href="menu.html" style="color:#007aff; font-size:1rem; font-weight:700;">
                    Tambahkan terlebih dahulu
                </a>
            </div>
        `;
        return;
    }

    cart.forEach((item, index) => {
        checkoutItems.innerHTML += `
            <div class="checkout-item">
                <span class="checkout-item-name">${item.name}</span>
                <div style="display:flex; align-items:center;">
                    <span class="checkout-item-price">Rp ${item.price.toLocaleString()}</span>
                    <button class="remove-item-btn" onclick="removeItem(${index})">Hapus</button>
                </div>
            </div>
        `;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    checkoutSummary.innerHTML = `
        <h3>Ringkasan Belanja</h3>
        <div class="checkout-total-row">
            <span>Total</span>
            <span>Rp ${total.toLocaleString()}</span>
        </div>
        <div class="payment-methods">
            <label class="payment-option">
                <input type="radio" name="payment" value="cash"> Cash
            </label>
            <label class="payment-option">
                <input type="radio" name="payment" value="qris"> QRIS
            </label>
        </div>
        <button class="checkout-btn disabled" disabled onclick="pay(${total})">
            Bayar Sekarang
        </button>
    `;
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCheckout();
}


// 🔥 Fungsi kirim order ke MongoDB via backend
async function sendOrderToDatabase(orderData) {
    try {
        const res = await fetch("https://your-backend-url.com/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        return await res.json();
    } catch (error) {
        console.error("Gagal mengirim ke database:", error);
    }
}


// 🔥 Fungsi bayar
async function pay(total) {
    if (!selectedPayment) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderID = "ODR-" + Date.now();

    const orderData = {
        orderID: orderID,
        items: cart,
        total: total,
        paymentMethod: selectedPayment,
        timestamp: new Date().toISOString()
    };

    // Kirim ke MongoDB
    await sendOrderToDatabase(orderData);

    // Simpan untuk halaman success
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Animasi loading sebelum redirect
    document.body.innerHTML += `
        <div class="loading-overlay">
            <div class="loader"></div>
            <p style="color:white; margin-top:15px;">Memproses pembayaran...</p>
        </div>
    `;

    setTimeout(() => {
        if (selectedPayment === "cash") {
            window.location.href = "success.html";
        } else {
            window.location.href = "qris.html";
        }
    }, 1500);
}
