const registerForm = document.getElementById('registerForm');

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

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('A server error occurred.', 'error');
    }
});
