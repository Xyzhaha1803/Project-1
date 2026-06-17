// Script for the edit modal
const editButton = document.getElementById('editButton');
const edit_modal_container = document.getElementById('edit_modal_container');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');

const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');

// Opening the edit modal
editButton.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    emailInput.value = profileEmail.textContent;
    edit_modal_container.classList.add('show');
});

// Changes button

const closeForm = () => {
    edit_modal_container.classList.remove('show');
};

saveButton.addEventListener('click', () => {
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();

    if (newName) {
        profileName.textContent = newName;
    }

    if (newEmail) {
        profileEmail.textContent = newEmail;
    }

    closeForm();
});

// Cancel button
cancelButton.addEventListener('click', () => {
    edit_modal_container.classList.remove('show');
})

// LocalStorage for user input data
document.addEventListener("DOMContentLoaded", () => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    const nameElement = document.getElementById("profileName");
    const emailElement = document.getElementById("profileEmail");
    const avatarElement = document.getElementById("avatar");

    if (storedName) {
        nameElement.textContent = storedName;
    }

    if (storedEmail) {
        emailElement.textContent = storedEmail;
    }
});