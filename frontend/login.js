const loginForm = document.getElementById('loginForm');

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    toastMessage.textContent = message;

    if (type === 'success') {
        toast.className = 'toast success show';
        toastIcon.textContent = '✓';
    } else {
        toast.className = 'toast error show';
        toastIcon.textContent = '✕';
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showToast(`Welcome, ${data.user.name}`, 'success');

            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = '/customers';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 800);
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('A server error occurred.', 'error');
    }
});
