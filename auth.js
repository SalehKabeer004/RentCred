import { supabase } from './dbConnection.js';
const logoutBtn = document.getElementById('logout-btn');
// if (logoutBtn) logoutBtn.style.display = "none"; // Hide logout button by default

// 1. Signup Logic
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const role = document.getElementById('role').value;

        // Signup logic (Updated)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: `${firstName} ${lastName}`,
                    user_role: role // 'owner' ya 'renter'
                }
            }
        });

        if (error) alert(error.message);
        else alert("Signup successful!");
    });
}

// 2. Login Logic
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) alert(error.message);
        else {
            const logoutBtn = document.getElementById('logout-btn');
            alert("Login successful!");
            window.location.href = "dashboard.html";
            logoutBtn.style.display = "block";
        }
    });
}

//3. Logout Logic
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();
        const logoutBtn = document.getElementById('logout-btn');
        if (error) alert(error.message);
        else {
            alert("Logout successful!");
            window.location.href = "index.html";
            logoutBtn.style.display = "none";
        }
    });
}

// 4. Forgot Password Logic
const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('forgot-password-email').value;

        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) alert(error.message);
        else alert("Password reset link sent to your email!");
    });
}