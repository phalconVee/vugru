document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const spinner = loginButton.querySelector('.spinner');
    const buttonText = loginButton.querySelector('.button-text');

    // Mock authentication function
    async function mockAuthenticate(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'vinny.vicci@gmail.com' && password === 'themandalorin') {
                    resolve({ success: true });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1500);
        });
    }

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset errors
        document.querySelectorAll('.error-text').forEach(elem => elem.style.display = 'none');
        
        let hasError = false;
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Email validation
        if (!email) {
            document.getElementById('emailError').textContent = 'Email is required';
            document.getElementById('emailError').style.display = 'block';
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            document.getElementById('emailError').style.display = 'block';
            hasError = true;
        }

        // Password validation
        if (!password) {
            document.getElementById('passwordError').textContent = 'Password is required';
            document.getElementById('passwordError').style.display = 'block';
            hasError = true;
        }

        if (hasError) {
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            return;
        }

        // Show loading state
        loginButton.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.textContent = 'Signing in...';

        try {
            const BASE_URL = 'http://localhost:3000';

            await mockAuthenticate(email, password);
            // Simulate redirect
            window.location.href = '/dashboard.html';
        } catch (error) {
            document.getElementById('passwordError').textContent = error.message;
            document.getElementById('passwordError').style.display = 'block';
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
        } finally {
            // Reset button state
            loginButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'Sign in';
        }
    });
});