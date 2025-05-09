import { 
    getJournalsFromStorage, 
    saveJournalsToStorage, 
    saveSingleJournalToStorage,
    removeJournalFromStorage 
} from './storage.js';

export const journalArray = getJournalsFromStorage();

export function createJournalEntry(formData) {
    const now = new Date();
    const timeCreated = `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
        now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const journalEntry = Object.fromEntries(formData.entries());
    journalEntry.id = timeCreated;
    
    journalArray.push(journalEntry);
    saveJournalsToStorage(journalArray);
    saveSingleJournalToStorage(journalEntry);
    
    return journalEntry;
}

export function updateJournalEntry(editingId, formData) {
    const index = journalArray.findIndex(entry => entry.id === editingId);
    if (index !== -1) {
        const updatedEntry = {
            ...journalArray[index],
            ...Object.fromEntries(formData.entries())
        };
        journalArray[index] = updatedEntry;
        saveJournalsToStorage(journalArray);
        return updatedEntry;
    }
    return null;
}

export function deleteJournalEntry(journalId) {
    const index = journalArray.findIndex(entry => entry.id === journalId);
    if (index !== -1) {
        journalArray.splice(index, 1);
        saveJournalsToStorage(journalArray);
        removeJournalFromStorage(journalId);
        return true;
    }
    return false;
}

export function searchJournals(searchValue) {
    return journalArray.filter(journal => 
        journal.journal_detail_title.toLowerCase().includes(searchValue) ||
        journal.journal_entry_textarea.toLowerCase().includes(searchValue)
    );
}

export function filterJournalsByMood(moodValue) {
    return journalArray.filter(journal => 
        journal.journal_mood_dropdown === moodValue
    );
}