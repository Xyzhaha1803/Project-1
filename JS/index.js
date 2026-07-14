// Script for forms
const username = document.getElementById('usernameinput')
const email = document.getElementById('emailinput')
const password = document.getElementById('passwordinput')
const repeatpassword = document.getElementById('repeatpasswordinput')

const form = document.getElementById('form')

const error = document.getElementById('errors')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let errors = [];

    // Username Validation
    if (username.value === "" || username.value == null) {
        errors.push("Username is required");
    }

    // Email Validation
    if (email.value === "" || !email.value.includes('@')) {
        errors.push("Please enter a valid email address");
    }

    // Password Validation
    if (password.value.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    if (password.value !== repeatpassword.value) {
        errors.push("Passwords must match");
    }

    if (errors.length > 0) {
        e.preventDefault();
        error.innerText = errors.join(", ");
    } else {
        error.innerHTML = "";

        // Creates user object
        const user = {
            username: username.value,
            email: email.value,
            password: password.value
        };

        // Initialize empty array
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // push new user into ze array
        users.push(user);

        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("username", username.value);
        localStorage.setItem("email", email.value);

        // Once successful, send to Homepage
        window.location.href = "Pages/HomePage.html";
    }
});// Prevents form from being submitted, if have errors


// Script for Sign up Modal
const sign_open = document.getElementById('sign_open')
const modal_container = document.getElementById('modal_container')
const sign_close = document.getElementById('sign_close')

sign_open.addEventListener('click', () => {
    modal_container.classList.add('show')
})

sign_close.addEventListener('click', () => {
    modal_container.classList.remove('show')
})

// Script for Login Modal
const login = document.getElementById('login')
const login_modal_container = document.getElementById('login_modal_container')
const login_close = document.getElementById('login_close')
const switch_to_signup = document.getElementById('switch_to_signup')

login.addEventListener('click', (e) => {
    e.preventDefault()
    modal_container.classList.remove('show')
    login_modal_container.classList.add('show')
})

login_close.addEventListener('click', () => {
    login_modal_container.classList.remove('show')
})

switch_to_signup.addEventListener('click', () => {
    login_modal_container.classList.remove('show')
    modal_container.classList.add('show')
})

// Script for login form validation
const login_form = document.getElementById('login_form')
const loginusername_input = document.getElementById('loginusername_input')
const loginpassword_input = document.getElementById('loginpassword_input')
const login_errors = document.getElementById('login_errors')

// Hardcoded classic
let adminUser = "Admin" // Example; ask cher on how to do normally
let adminPassword = "12345"

login_form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (loginusername_input.value === adminUser && loginpassword_input.value === adminPassword) {
        window.location.href = "Pages/HomePage.html"
    } else {
        login_errors.innerText = "Incorrect Username and/or Password";
    }
})

// Script for the dashboard sign up
const StartButton = document.getElementById('StartButton')

StartButton.addEventListener('click', () => {
    login_modal_container.classList.add('show')
})