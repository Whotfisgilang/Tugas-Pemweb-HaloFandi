document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageElement = document.getElementById('message');

    const LOGIN_URL = 'http://localhost:4000/api/auth/login'; // FIXED

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        messageElement.textContent = 'Memproses Login...';
        messageElement.style.color = '#007aff';

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // SIMPAN TOKEN
                localStorage.setItem('token', data.token);

                messageElement.textContent = 'Login Berhasil! Mengalihkan...';
                messageElement.style.color = '#34c759';
                
                setTimeout(() => window.location.href = 'menu.html', 800);
            } 
            else {
                messageElement.textContent = data.message || 'Email atau password salah.';
                messageElement.style.color = '#ff3b30';
            }

        } catch (error) {
            console.error('Error login:', error);
            messageElement.textContent = 'Terjadi kesalahan koneksi server.';
            messageElement.style.color = '#ff3b30';
        }
    });
});
