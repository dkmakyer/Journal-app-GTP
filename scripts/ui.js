import { 
  journalArray, 
  createJournalEntry, 
  updateJournalEntry, 
  deleteJournalEntry,
  searchJournals,
  filterJournalsByMood
} from './journal.js';

export const journalEntryModal = document.getElementById("journal-entry-modal");
export const journalDetailContainer = document.getElementById("journal-detail-container");
export const journalEntryForm = document.getElementById("journal-entry-form");
export const journalListContainer = document.getElementById("journal-list-container");

const moodIcon = {
  happy: "fa-smile-beam",
  sad: "fa-sad-tear",
  motivated: "fa-fire",
  stressed: "fa-flushed",
  scared: "fa-surprise",
};

//filter for the buttons
const moodMap = {
  'Happy': 'happy',
  'Sad': 'sad',
  'Motivated': 'motivated',
  'Stressed': 'stressed',
  'Scared': 'scared'
};


export function initializeEventListeners() {
  journalEntryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFormSubmit();
  });

  document.getElementById("journal-display-button").addEventListener("click", () => {
      journalEntryModal.classList.remove("hidden");
  });

  document.getElementById("hide-journal-entry-modal").addEventListener("click", () => {
      journalEntryModal.classList.add("hidden");
  });

  // Search functionality
  document.getElementById("search-input").addEventListener("input", (e) => {
      const searchValue = e.target.value.toLowerCase();
      const result = searchJournals(searchValue);
      renderJournalList(result);
  });

  // applying event delegation to Mood filter buttons
  const moodFilterButtons = document.querySelector('.mood-filter-buttons');
  moodFilterButtons.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
          const moodText = e.target.textContent.trim();
          if (moodText === 'All') {
              renderJournalList(journalArray);
          } else {
              const moodValue = moodMap[moodText];
              const filteredJournals = filterJournalsByMood(moodValue);
              renderFilteredJournals(filteredJournals, moodText);
          }
      }
  });
}

export function handleFormSubmit() {
  try {
      const formData = new FormData(journalEntryForm);
      const isEdit = journalEntryForm.dataset.editingId;
      
      if (isEdit) {
          updateJournalEntry(isEdit, formData);
          delete journalEntryForm.dataset.editingId;
      } else {
          createJournalEntry(formData);
      }

      journalEntryForm.reset();
      journalEntryModal.classList.add("hidden");
      renderJournalList(journalArray);
  } catch (error) {
      console.log("error", error);
  }
}

// render the Journal list 
export function renderJournalList(journals = journalArray) {
  journalListContainer.innerHTML = "";

  if (journals.length === 0) {
      journalListContainer.innerHTML = `<p class="no-results">No journals found</p>`;
      return;
  }

  journals.forEach((journal) => {
      const currentMood = moodIcon[journal.journal_mood_dropdown];
      journalListContainer.innerHTML += `
          <div class="journal-list" data-id="${journal.id}">
              <div class="journal-title">
                  <h2><i class="fas fa-bookmark"></i> ${journal.journal_detail_title}</h2>
              </div>
              <div class="journal-mood">
                  <p>Vibe <i class="fas fa-heart"></i> : <span>${journal.journal_mood_dropdown}</span> <i class="fas ${currentMood}"></i> </p>
              </div>
              <div class="timestamp">
                  <p>Posted <i class="far fa-clock"></i> : <span>${journal.id}</span></p>
              </div>
              <h3><i class="fas fa-align-left"></i> ${journal.journal_entry_textarea.substring(0, 100)}...</h3>
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
          }
      }
  });
}

// render the Journal detail 
export function showJournalDetail(journal) {
  journalDetailContainer.innerHTML = "";
  journalDetailContainer.classList.remove("hidden");

  let currentMood = moodIcon[journal.journal_mood_dropdown];
  journalDetailContainer.innerHTML = `
      <h1 class="journal-detail-container-title">
          <i class="fas fa-book-open"></i> ${journal.journal_detail_title.toUpperCase()}
      </h1>
      <div class="journal-top-content">
          <p class="journal-detail-mood">
              Vibe <i class="fas fa-heart"></i> : <span>${journal.journal_mood_dropdown}</span>
              <i class="fas ${currentMood}"></i>
          </p>
          <p class="journal-detail-timestamp">
              Time <i class="far fa-clock"></i> : <span>${journal.id}</span>
          </p>
      </div>
      <div class="journal-detail-content">
          <h2><i class="fas fa-align-left"></i> Content:</h2>
          <p class="journal-detail-text">
              ${journal.journal_entry_textarea}
          </p>
      </div>
      <div class="journal-detail-buttons">
          <button id="journal-edit-button">Edit Entry <i class="fas fa-edit"></i></button>
          <button id="journal-delete-button">Delete Entry <i class="fas fa-trash-alt"></i></button>
          <button id="back-to-list-button">
              Back to List <i class="fas fa-arrow-left"></i>
          </button>
      </div>`;

  document.getElementById("back-to-list-button").addEventListener("click", () => {
      journalDetailContainer.classList.add("hidden");
  });

  document.getElementById("journal-edit-button").addEventListener("click", () => {
      journalDetailContainer.classList.add("hidden");
      journalEntryModal.classList.remove("hidden");
      rePopulateForm(journal);
  });

  document.getElementById("journal-delete-button").addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this journal?")) {
          if (deleteJournalEntry(journal.id)) {
              journalDetailContainer.classList.add("hidden");
              renderJournalList();
          }
      }
  });
}

// edit the form
export function rePopulateForm(journal) {
  document.getElementById('journal-detail-title').value = journal.journal_detail_title;
  document.getElementById('journal-mood-dropdown').value = journal.journal_mood_dropdown;
  document.getElementById('journal-entry-textarea').value = journal.journal_entry_textarea;
  journalEntryForm.dataset.editingId = journal.id;
}

// Filtered journals rendering
export function renderFilteredJournals(filteredJournals, moodText) {
  journalListContainer.innerHTML = '';
  
  if (filteredJournals.length === 0) {
      journalListContainer.innerHTML = `<p class="no-results">No ${moodText} journals found</p>`;
      return;
  }
  
  renderJournalList(filteredJournals);
}

document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners();
  renderJournalList();
});