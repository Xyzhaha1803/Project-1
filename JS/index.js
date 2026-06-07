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