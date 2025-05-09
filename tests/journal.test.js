import {
  journalArray,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  searchJournals,
  filterJournalsByMood
} from '../scripts/journal'; 


jest.mock('../scripts/storage', () => ({
  getJournalsFromStorage: jest.fn(() => []),
  saveJournalsToStorage: jest.fn(),
  saveSingleJournalToStorage: jest.fn(),
  removeJournalFromStorage: jest.fn(),
}));

describe('Journal Functions', () => {
  let mockFormData;

  beforeEach(() => {
      journalArray.length = 0;
      mockFormData = {
          entries: jest.fn().mockReturnValue([
              ['journal_detail_title', 'Test Title'],
              ['journal_entry_textarea', 'Test content'],
              ['journal_mood_dropdown', 'happy']
          ])
      };
  });

  describe('createJournalEntry', () => {
      it('should create a new journal entry and return it', () => {
          const result = createJournalEntry(mockFormData);
          expect(result).toHaveProperty('id');
          expect(result.journal_detail_title).toBe('Test Title');
          expect(journalArray).toHaveLength(1);
      });
  });

  describe('updateJournalEntry', () => {
      it('should update an existing journal entry', () => {
          const entry = createJournalEntry(mockFormData);
          const updatedFormData = {
              entries: jest.fn().mockReturnValue([
                  ['journal_detail_title', 'Updated Title'],
                  ['journal_entry_textarea', 'Updated content'],
                  ['journal_mood_dropdown', 'motivated']
              ])
          };

          const result = updateJournalEntry(entry.id, updatedFormData);
          expect(result.journal_detail_title).toBe('Updated Title');
          expect(journalArray[0].journal_detail_title).toBe('Updated Title');
      });

      it('should return null for non-existent ID', () => {
          const result = updateJournalEntry('non-existent-id', mockFormData);
          expect(result).toBeNull();
      });
  });

  describe('deleteJournalEntry', () => {
      it('should delete an entry and return true', () => {
          const entry = createJournalEntry(mockFormData);
          const result = deleteJournalEntry(entry.id);
          expect(result).toBe(true);
          expect(journalArray).toHaveLength(0);
      });

      it('should return false for non-existent ID', () => {
          const result = deleteJournalEntry('non-existent-id');
          expect(result).toBe(false);
      });
  });

  describe('searchJournals', () => {
      it('should return an empty array for no matches', () => {
          createJournalEntry(mockFormData);
          const results = searchJournals('Non-existent Title');
          expect(results).toHaveLength(0);
      });
  });

  describe('filterJournalsByMood', () => {
      it('should return entries that match the specified mood', () => {
          createJournalEntry(mockFormData);
          const results = filterJournalsByMood('happy');
          expect(results).toHaveLength(1);
          expect(results[0].journal_mood_dropdown).toBe('happy');
      });

      it('should return an empty array for non-existent mood', () => {
          createJournalEntry(mockFormData);
          const results = filterJournalsByMood('sad');
          expect(results).toHaveLength(0);
      });
  });
});
