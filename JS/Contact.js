// JS to change the form content based on the selection

document.addEventListener("DOMContentLoaded", function() {
    const Selection = document.getElementById("type")
    
    // All the sections that can be chnaged to
    const inquirySec = document.getElementById("inquirysection")
    const complaintSec = document.getElementById("complaintsection")
    const reviewSec = document.getElementById("reviewsection")
    const otherSec = document.getElementById("othersection")

    // All the inputs of the above sections
    const inquiryInput = document.getElementById("inquiry")
    const complaintInput = document.getElementById("complaint")
    const reviewComment = document.getElementById("comment")
    const star1Input = document.getElementById("star1")
    const otherInput = document.getElementById("otherText")

    function updateForm() {
        const val = Selection.value

        // Toggle the visibilitiy using show class if the selection value matches
        inquirySec.classList.toggle("show", val === "inquiry")
        complaintSec.classList.toggle("show", val === "complaint")
        reviewSec.classList.toggle("show", val === "review")
        otherSec.classList.toggle("show", val === "other")

        // Toggle the required for inputs if the selection value matches
        inquiryInput.required = (val === "inquiry")
        complaintInput.required = (val === "complaint")
        otherInput.required = (val === "other")
        star1Input.required = (val === "review")
        reviewComment.required = (val === "review")
    }

    // Runs when the user uses the dropdown selection menu
    Selection.addEventListener("change", updateForm)

    // inquiry as default
    Selection.value = "inquiry"
    updateForm()
})

// Back Button JS to go back one page based on where the user clicks the contact redirect
const backButton = document.getElementById("BackButton")

backButton.addEventListener("click", function() {
    window.history.back()
})

// Reseting Form
const form = document.getElementById("ContactFormContainer");

form.addEventListener("submit", function(event) {
    event.preventDefault()
    
    console.log("Form Submitted successfully!")

    form.reset()

    updateForm()
});
