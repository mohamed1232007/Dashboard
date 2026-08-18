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
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        // 🟢 سطور زيادة للـ Console عشان تعرف الرد جاي إزاي بالضبط
        console.log('Response Status:', response.status); // هيطبع لك 200 أو 404 أو 500
        console.log('Response OK:', response.ok);       // true أو false

        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);      // هيطبع هل الرد application/json ولا text/html

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response Data:', data);        // هيطبع الـ JSON اللي راجع من السيرفر

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
        } else {
            // 🔴 لو الرد مش JSON (يعني السيرفر بره رجع HTML 404/500)
            const textResponse = await response.text();
            console.error('Server returned HTML instead of JSON:', textResponse); // هيطبع نص صفحة الإيرور كاملة في الكونسول
            showToast(`Server returned status: ${response.status}`, 'error');
        }

    } catch (error) {
        // 🔴 حط تفاصيل الإيرور بالكامل هنا
        console.error('Fetch Error details:', error.name, error.message);
        console.error('Full Error Object:', error);
        showToast('A server error occurred.', 'error');
    }
});
