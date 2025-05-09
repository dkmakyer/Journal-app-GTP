export function getJournalsFromStorage() {
    return JSON.parse(localStorage.getItem("journalArray")) || [];
}

export function saveJournalsToStorage(journals) {
    localStorage.setItem("journalArray", JSON.stringify(journals));
}

export function saveSingleJournalToStorage(journal) {
    localStorage.setItem(`entry_${journal.id}`, JSON.stringify(journal));
}

export function removeJournalFromStorage(journalId) {
    localStorage.removeItem(`entry_${journalId}`);
}