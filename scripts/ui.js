
export function renderUI(){
    const journalEntryModalWrapper = document.getElementById("journal-entry-modal-wrapper");
    const journalDetailContainerWrapper = document.getElementById("journal-detail-container-wrapper");
    document.getElementById("back-to-list-button").addEventListener("click", () => {
        journalDetailContainerWrapper.classList.add("hidden");
    });
    
    document.getElementById("journal-display-button").addEventListener("click", () => {
        journalEntryModalWrapper.classList.remove("hidden");
    });
    
    document.getElementById("hide-journal-entry-modal").addEventListener("click", () => {
        journalEntryModalWrapper.classList.add("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => renderUI());