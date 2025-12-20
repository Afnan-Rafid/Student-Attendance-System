document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const mockUsername = 'teacher';
    const mockPassword = 'password';

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if (usernameInput === mockUsername && passwordInput === mockPassword) {
        alert('Login successful! Redirecting to dashboard.');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
});