const regForm = document.getElementById("regForm");

regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
    };

    try {
        const res = await fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const data = await res.json();

        if (!res.ok) return alert(data.message || "Register gagal");

        alert("Berhasil daftar!");
        window.location.href = "login.html";

    } catch (err) {
        alert("Terjadi kesalahan");
    }
});
