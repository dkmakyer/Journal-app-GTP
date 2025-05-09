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
  populateForm();
});

function populateForm() {
  try {
    const formData = new FormData(journalEntryForm);
    const journalEntry = Object.fromEntries(formData.entries());
    
    const isEdit = journalEntryForm.dataset.editingId;
    
    if (isEdit) {
      //find the journal to edit by its index
      const index = journalArray.findIndex(entry => entry.id === isEdit);
      if (index !== -1) {
        journalArray[index] = {
          ...journalArray[index],
          ...journalEntry
        };
      }
      delete journalEntryForm.dataset.editingId;
    } else {

      const now = new Date();
      const timeCreated = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
      ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      journalEntry.id = timeCreated;
      journalArray.push(journalEntry);
    }

    localStorage.setItem("journalArray", JSON.stringify(journalArray));
    
    if (!isEdit) {//store journal in local storage it its not something you are editing
      localStorage.setItem(`entry_${journalEntry.id}`, JSON.stringify(journalEntry));
    }

    journalEntryForm.reset();
    journalEntryModal.classList.add("hidden");
    renderJournal();
    
  } catch (error) {
    console.log("error", error);
  }
}

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
        <h3><i class="fas fa-align-left"></i> ${journalList.journal_entry_textarea.substring(0, 100)}...</h3>
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

  document.getElementById("journal-edit-button").addEventListener("click", () => {
    journalDetailContainer.classList.add("hidden");
    journalEntryModal.classList.remove("hidden");
    //function to populate the input with the already existing data
    rePopulateForm(journalList);
  });

  document.getElementById("journal-delete-button").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this journal?")) {
      const index = journalArray.findIndex(entry => entry.id === journalList.id);
      
      if (index !== -1) {
        journalArray.splice(index, 1);
        
        localStorage.setItem("journalArray", JSON.stringify(journalArray));
        localStorage.removeItem(`entry_${journalList.id}`);
        
        journalDetailContainer.classList.add("hidden");
        renderJournal();
      }
    }
  });
}

function rePopulateForm(journal) {
    document.getElementById('journal-detail-title').value = journal.journal_detail_title;
    document.getElementById('journal-mood-dropdown').value = journal.journal_mood_dropdown;
    document.getElementById('journal-entry-textarea').value = journal.journal_entry_textarea;
    
    //create an id for the journal to be edited
    journalEntryForm.dataset.editingId = journal.id;
}


//search input functionality
document.getElementById("search-input").addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  
  const result = journalArray.filter(journal => 
    journal.journal_detail_title.toLowerCase().includes(searchValue) ||
    journal.journal_entry_textarea.toLowerCase().includes(searchValue)
  );
  
  renderSearchResults(result); 
});

function renderSearchResults(result) {
  journalListContainer.innerHTML = "";
  
  if (result.length === 0) {
    journalListContainer.innerHTML = `<p class="no-results">No matching journals found</p>`;
    return;
  }

  result.forEach(journal => {
    const currentMood = moodIcon[journal.journal_mood_dropdown];
    journalListContainer.innerHTML += `
      <div class="journal-list" data-id="${journal.id}">
        <div class="journal-title">
          <h2><i class="fas fa-bookmark"></i> ${journal.journal_detail_title}</h2>
        </div>
        <div class="journal-mood">
          <p>Vibe <i class="fas fa-heart"></i> : <span>${journal.journal_mood_dropdown}</span> <i class="fas ${currentMood}"></i></p>
        </div>
        <div class="timestamp">
          <p>Posted <i class="far fa-clock"></i> : <span>${journal.id}</span></p>
        </div>
        <h3><i class="fas fa-align-left"></i> ${journal.journal_entry_textarea.substring(0, 100)}...</h3>
      </div>
    `;
  });
}

// Add mood filter functionality for buttons
const moodFilterButtons = document.querySelector('.mood-filter-buttons');

const moodMap = {
  'Happy': 'happy',
  'Sad': 'sad',
  'Motivated': 'motivated',
  'Stressed': 'stressed',
  'Scared': 'scared'
};

moodFilterButtons.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const moodText = e.target.textContent.trim();
    
    if (moodText === 'All') {
      renderJournal();
    } else {
      const moodValue = moodMap[moodText];
      const filteredJournals = journalArray.filter(journal => 
        journal.journal_mood_dropdown === moodValue
      );
      
      renderFilteredJournals(filteredJournals, moodText);
    }
  }
});

function renderFilteredJournals(filteredJournals, moodText) {
  journalListContainer.innerHTML = '';
  
  if (filteredJournals.length === 0) {
    journalListContainer.innerHTML = `
      <p class="no-results">No ${moodText} journals found</p>
    `;
    return;
  }
  
  filteredJournals.forEach(journal => {
    const currentMood = moodIcon[journal.journal_mood_dropdown];
    journalListContainer.innerHTML += `
      <div class="journal-list" data-id="${journal.id}">
        <div class="journal-title">
          <h2><i class="fas fa-bookmark"></i> ${journal.journal_detail_title}</h2>
        </div>
        <div class="journal-mood">
          <p>Vibe <i class="fas fa-heart"></i> : <span>${journal.journal_mood_dropdown}</span> <i class="fas ${currentMood}"></i></p>
        </div>
        <div class="timestamp">
          <p>Posted <i class="far fa-clock"></i> : <span>${journal.id}</span></p>
        </div>
        <h3><i class="fas fa-align-left"></i> ${journal.journal_entry_textarea.substring(0, 100)}...</h3>
      </div>
    `;
  });
}



document.addEventListener("DOMContentLoaded", () => renderJournal());
