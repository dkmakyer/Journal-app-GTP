const journalEntryModal = document.getElementById("journal-entry-modal");
const journalDetailContainer = document.getElementById("journal-detail-container");
const mainContainer = document.getElementById("main-container");
const journalEntryForm = document.getElementById("journal-entry-form");


//on the first render, retrieve an existing journal from local storage, or initialize an empty array
const journalArray = JSON.parse(localStorage.getItem("journalArray")) || [];

//extract the form data at once
journalEntryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(journalEntryForm);
    const journalEntry = Object.fromEntries(formData.entries());
    let timeCreated = Date.now();

    journalEntry.id = timeCreated.toString();

    journalArray.push(journalEntry);
    //store the entire array
    localStorage.setItem("journalArray", JSON.stringify(journalArray));
    
    //store the individual entry for faster search
    localStorage.setItem(`entry_${timeCreated}`, JSON.stringify(journalEntry));//saved them with the time created to make the key in the local storage unique
    
    journalEntryForm.reset();
    journalEntryModal.classList.add("hidden");
});

document.getElementById("back-to-list-button").addEventListener("click", () => {
    journalDetailContainer.classList.add("hidden");
});

document.getElementById("journal-display-button").addEventListener("click", () => {
    journalEntryModal.classList.remove("hidden");
});

document.getElementById("hide-journal-entry-modal").addEventListener("click", () => {
    journalEntryModal.classList.add("hidden");
});

// export function renderUI(){

// }

// document.addEventListener("DOMContentLoaded", () => renderUI());