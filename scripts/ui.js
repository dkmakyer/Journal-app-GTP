const journalEntryModal = document.getElementById("journal-entry-modal");
const journalDetailContainer = document.getElementById(
  "journal-detail-container"
);
const journalEntryForm = document.getElementById("journal-entry-form");
const journalListContainer = document.getElementById("journal-list-container");

// On the first render, retrieve an existing journal from local storage, or initialize an empty array
const journalArray = JSON.parse(localStorage.getItem("journalArray")) || [];
console.log(journalArray);

// Extract the form data at once
journalEntryForm.addEventListener("submit", (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(journalEntryForm);
    const journalEntry = Object.fromEntries(formData.entries());

    const now = new Date();
    const timeCreated = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    journalEntry.id = timeCreated;

    journalArray.push(journalEntry);
    // Store the entire array
    localStorage.setItem("journalArray", JSON.stringify(journalArray));

    // Store the individual entry for faster search
    localStorage.setItem(`entry_${timeCreated}`, JSON.stringify(journalEntry)); // Saved them with the time created to make the key in the local storage unique

    journalEntryForm.reset();
    journalEntryModal.classList.add("hidden");

    renderUI(); 
  } catch (error) {
    console.log("error", error);
  }
});

document.getElementById("back-to-list-button").addEventListener("click", () => {
  journalDetailContainer.classList.add("hidden");
});

document
  .getElementById("journal-display-button")
  .addEventListener("click", () => {
    journalEntryModal.classList.remove("hidden");
  });

document
  .getElementById("hide-journal-entry-modal")
  .addEventListener("click", () => {
    journalEntryModal.classList.add("hidden");
  });

export function renderUI() {
  journalListContainer.innerHTML = "";

  // To render the journal
  journalArray.map((journalList) => {
    const moodIcon = {
      happy: "fa-smile-beam",
      sad: "fa-sad-tear",
      motivated: "fa-fire",
      stressed: "fa-flushed",
      scared: "fa-surprise",
    };

    let currentMood = moodIcon[journalList.journal_mood_dropdown];
    journalListContainer.innerHTML += `
    <div class="journal-list">
            <div class="journal-title">
              <h2><i class="fas fa-bookmark"></i> ${journalList.journal_detail_title}</h2>
            </div>
            <div class="journal-mood">
              <p>Vibe <i class="fas fa-heart"></i> : <span>${journalList.journal_mood_dropdown}</span> <i class="fas ${currentMood}"></i> </p>
            </div>
            <div class="timestamp">
              <p>Posted <i class="far fa-clock"></i> : <span>${journalList.id}</span></p>
            </div>
            <h3><i class="fas fa-align-left"></i> ${journalList.journal_entry_textarea}</h3>
          </div>
`;
  });
}

document.addEventListener("DOMContentLoaded", () => renderUI());
