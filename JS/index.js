// Script for forms
const username = document.getElementById('usernameinput')
const email = document.getElementById('emailinput')
const password = document.getElementById('passwordinput')
const repeatpassword = document.getElementById('repeatpasswordinput')

const form = document.getElementById('form')

const error = document.getElementById('errors')

form.addEventListener('submit', (e) => {
    let errors = []

    // Username Validation
    if (username.value === "" || username.value == null){
        errors.push("Username is required")
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

    if (errors.length > 0){
        e.preventDefault()
        error.innerText = errors.join(", ")
    } else {
        error.innerHTML = ""
    }
}) // Prevents form from being submitted, if have errors


// Script for Sing up Modal
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

login.addEventListener('click', (e) => {
    e.preventDefault();
    modal_container.classList.remove('show');
    login_modal_container.classList.add('show');
});