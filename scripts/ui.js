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

    renderJournal();
  } catch (error) {
    console.log("error", error);
  }
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

const moodIcon = {
  happy: "fa-smile-beam",
  sad: "fa-sad-tear",
  motivated: "fa-fire",
  stressed: "fa-flushed",
  scared: "fa-surprise",
};

export function renderJournal() {
  journalListContainer.innerHTML = "";

  // To render the journal
  journalArray.forEach((journalList) => {
    const currentMood = moodIcon[journalList.journal_mood_dropdown];
    journalListContainer.innerHTML += `
      <div class="journal-list" data-id="${journalList.id}">
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

  journalListContainer.addEventListener('click', (event) => {
    const journalElement = event.target.closest('.journal-list');
    if (journalElement) {
      const journalId = journalElement.dataset.id;
      const journal = journalArray.find(j => j.id === journalId);
      if (journal) {
        showJournalDetail(journal);
        journalDetailContainer.classList.remove("hidden");
      }
    }
  });
}
function showJournalDetail(journalList) {
  journalDetailContainer.innerHTML = "";

  let currentMood = moodIcon[journalList.journal_mood_dropdown];
  journalDetailContainer.innerHTML = `<h1 class="journal-detail-container-title">
          <i class="fas fa-book-open"></i> ${journalList.journal_detail_title.toUpperCase()}
          </h1>
          <div class="journal-top-content">
          <p class="journal-detail-mood">
            Vibe <i class="fas fa-heart"></i> : <span>${journalList.journal_mood_dropdown}</span>
            <i class="fas ${currentMood}"></i>
            </p>
            <p class="journal-detail-timestamp">
            Time <i class="far fa-clock"></i> : <span>${journalList.id}</span>
            </p>
            </div>
            <div class="journal-detail-content">
            <h2><i class="fas fa-align-left"></i> Content:</h2>
            <p class="journal-detail-text">
          ${journalList.journal_entry_textarea}
          </p>
          </div>
          <div class="journal-detail-buttons">
          <button id="journal-edit-button">Edit Entry <i class="fas fa-edit"></i></button>
          <button id="journal-delete-button">Delete Entry <i class="fas fa-trash-alt"></i></button>
          <button id="back-to-list-button">
            Back to List <i class="fas fa-arrow-left"></i>
            </button>
            </div>`;

  document
    .getElementById("back-to-list-button")
    .addEventListener("click", () => {
      journalDetailContainer.classList.add("hidden");
    });


}

document.addEventListener("DOMContentLoaded", () => renderJournal());
