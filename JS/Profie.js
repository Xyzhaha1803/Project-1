// Script for the edit modal [Broke]
const editButton = document.getElementById('editButton');
const edit_modal_container = document.getElementById('edit_modal_container');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const avatarInitial = document.getElementById('avatarInitial');

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