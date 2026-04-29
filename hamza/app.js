let creat_acount_form = document.getElementById("creat_acount_form")
let login_form = document.getElementById("login_form")
function showForm(){
    creat_acount_form.style.display = "flex"
    login_form.style.display = "none"
}
function login_form_function() {
        creat_acount_form.style.display = "none"
    login_form.style.display = "flex"
}


// // Form toggle
// function showForm(which) {
//   document.getElementById('login_form').style.display        = which === 'login'    ? 'flex' : 'none';
//   document.getElementById('creat_acount_form').style.display = which === 'register' ? 'flex' : 'none';
// }

// // Password show/hide
// function togglePw(inputId, iconId) {
//   const input = document.getElementById(inputId);
//   const icon  = document.getElementById(iconId);
//   const show  = input.type === 'password';
//   input.type  = show ? 'text' : 'password';
//   icon.innerHTML = show
//     ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
//     : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
// }

// // Password strength
// function checkStrength(val) {
//   const fill = document.getElementById('strengthFill');
//   const text = document.getElementById('strengthText');
//   if (!val) { fill.style.width = '0%'; text.textContent = ''; return; }
//   let score = 0;
//   if (val.length >= 8)          score++;
//   if (/[A-Z]/.test(val))        score++;
//   if (/[0-9]/.test(val))        score++;
//   if (/[^A-Za-z0-9]/.test(val)) score++;
//   const levels = [
//     { w: '25%', bg: '#e74c3c', label: 'Weak' },
//     { w: '50%', bg: '#f39c12', label: 'Fair' },
//     { w: '75%', bg: '#2ecc71', label: 'Good' },
//     { w: '100%', bg: '#27ae60', label: 'Strong' },
//   ];
//   const l = levels[score - 1] || levels[0];
//   fill.style.width       = l.w;
//   fill.style.background  = l.bg;
//   text.textContent       = 'Strength: ' + l.label;
//   text.style.color       = l.bg;
// }

// // Error helpers
// function showErr(id, inputEl) {
//   document.getElementById(id).classList.add('show');
//   inputEl?.closest('.inputForm')?.classList.add('error');
// }
// function clearErr(id, inputEl) {
//   document.getElementById(id).classList.remove('show');
//   inputEl?.closest('.inputForm')?.classList.remove('error');
// }

// // LOGIN
// function handleLogin() {
//   const emailEl = document.getElementById('loginEmail');
//   const passEl  = document.getElementById('loginPass');
//   const email   = emailEl.value.trim();
//   const pass    = passEl.value;
//   let valid = true;

//   clearErr('loginEmailErr', emailEl);
//   clearErr('loginPassErr',  passEl);

//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('loginEmailErr', emailEl); valid = false; }
//   if (!pass)                                        { showErr('loginPassErr',  passEl);  valid = false; }
//   if (!valid) return;

//   const btn = document.querySelector('#login_form .button-submit');
//   btn.textContent = 'Signing in...';
//   btn.disabled = true;

//   setTimeout(() => {
//     btn.textContent = 'Sign In';
//     btn.disabled = false;
//     window.location.href = 'dashboard.html';
//   }, 1200);
// }

// // REGISTER
// function handleRegister() {
//   const fields = {
//     firstName:   document.getElementById('firstName'),
//     lastName:    document.getElementById('lastName'),
//     regEmail:    document.getElementById('regEmail'),
//     regPass:     document.getElementById('regPass'),
//     confirmPass: document.getElementById('confirmPass'),
//   };
//   let valid = true;

//   Object.values(fields).forEach(el => el.closest('.inputForm')?.classList.remove('error'));
//   ['firstNameErr','lastNameErr','regEmailErr','regPassErr','confirmPassErr','termsErr']
//     .forEach(id => document.getElementById(id).classList.remove('show'));

//   if (!fields.firstName.value.trim())                                  { showErr('firstNameErr',   fields.firstName);   valid = false; }
//   if (!fields.lastName.value.trim())                                   { showErr('lastNameErr',    fields.lastName);    valid = false; }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.regEmail.value.trim())){ showErr('regEmailErr',   fields.regEmail);    valid = false; }
//   if (fields.regPass.value.length < 8)                                 { showErr('regPassErr',     fields.regPass);     valid = false; }
//   if (fields.confirmPass.value !== fields.regPass.value)               { showErr('confirmPassErr', fields.confirmPass); valid = false; }
//   if (!document.getElementById('terms').checked)                       { document.getElementById('termsErr').classList.add('show'); valid = false; }

//   if (!valid) return;

//   const btn = document.querySelector('#creat_acount_form .button-submit');
//   btn.textContent = 'Creating account...';
//   btn.disabled = true;

//   setTimeout(() => {
//     btn.textContent = 'Create Account';
//     btn.disabled = false;
//     window.location.href = 'dashboard.html';
//   }, 1200);
// }

// // Clear errors on typing
// document.getElementById('loginEmail').addEventListener('input',    () => clearErr('loginEmailErr',   document.getElementById('loginEmail')));
// document.getElementById('loginPass').addEventListener('input',     () => clearErr('loginPassErr',    document.getElementById('loginPass')));
// document.getElementById('firstName').addEventListener('input',     () => clearErr('firstNameErr',    document.getElementById('firstName')));
// document.getElementById('lastName').addEventListener('input',      () => clearErr('lastNameErr',     document.getElementById('lastName')));
// document.getElementById('regEmail').addEventListener('input',      () => clearErr('regEmailErr',     document.getElementById('regEmail')));
// document.getElementById('regPass').addEventListener('input',       () => clearErr('regPassErr',      document.getElementById('regPass')));
// document.getElementById('confirmPass').addEventListener('input',   () => clearErr('confirmPassErr',  document.getElementById('confirmPass')));
// document.getElementById('terms').addEventListener('change',        () => document.getElementById('termsErr').classList.remove('show'));

// // Enter key
// document.getElementById('loginPass').addEventListener('keydown',   e => { if (e.key === 'Enter') handleLogin(); });
// document.getElementById('confirmPass').addEventListener('keydown', e => { if (e.key === 'Enter') handleRegister(); });