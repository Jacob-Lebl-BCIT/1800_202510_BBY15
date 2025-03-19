let initialAccountName = document.getElementById("accountName").innerText;
let initialDateOfBirth = document.getElementById("dateOfBirth").innerText;
let initialDisplayName = document.getElementById("displayName").innerText;
let initialCountry = document.getElementById("country").innerText;
let initialPhoneNumber = document.getElementById("phoneNumber").innerText;
let initialEmail = document.getElementById("email").innerText;
let initialGender = document.getElementById("gender").innerText;

function editProfile() {


    document.getElementById("profileReadView").classList.add("d-none");
    document.getElementById("profileEditView").classList.remove("d-none");
    document.getElementById("saveButton").classList.remove("d-none");
    document.getElementById("cancelButton").classList.remove("d-none");
    document.getElementById("editButton").classList.add("d-none")
    document.getElementById("accountNameInput").value = initialAccountName;
    document.getElementById("dateOfBirthInput").value = initialDateOfBirth;
    document.getElementById("displayNameInput").value = initialDisplayName;
    document.getElementById("countryInput").value = initialCountry;
    document.getElementById("phoneNumberInput").value = initialPhoneNumber;
    document.getElementById("emailInput").value = initialEmail;
    document.getElementById("genderInput").value = initialGender;
}

function cancelEdit() {
    viewProfile();

}

function saveProfile() {
    viewProfile();
    let updatedAccountName = document.getElementById("accountNameInput").value;
    let updatedDateOfBirth = document.getElementById("dateOfBirthInput").value;
    let updatedDisplayName = document.getElementById("displayNameInput").value;
    let updatedCountry = document.getElementById("countryInput").value;
    let updatedPhoneNumber = document.getElementById("phoneNumberInput").value;
    let updatedEmail = document.getElementById("emailInput").value;
    let updatedGender = document.getElementById("genderInput").value;

    document.getElementById("accountName").innerText = updatedAccountName;
    document.getElementById("dateOfBirth").innerText = updatedDateOfBirth;
    document.getElementById("displayName").innerText = updatedDisplayName;
    document.getElementById("country").innerText = updatedCountry;
    document.getElementById("phoneNumber").innerText = updatedPhoneNumber;
    document.getElementById("email").innerText = updatedEmail;
    document.getElementById("gender").innerText = updatedGender;


}

function viewProfile() {
    document.getElementById("profileReadView").classList.remove("d-none");
    document.getElementById("profileEditView").classList.add("d-none");
    document.getElementById("editButton").classList.remove("d-none")
    document.getElementById("saveButton").classList.add("d-none");
    document.getElementById("cancelButton").classList.add("d-none");
}

