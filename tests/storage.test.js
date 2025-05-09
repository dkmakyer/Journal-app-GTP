import {
    journalArray,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    searchJournals,
    filterJournalsByMood,
  } from '../scripts/journal';

  /**jest-environment jsdom */
  
  // Mock the storage module completely
  jest.mock('../scripts/storage', () => ({
    getJournalsFromStorage: jest.fn().mockReturnValue([]),
    saveJournalsToStorage: jest.fn(),
    saveSingleJournalToStorage: jest.fn(),
    removeJournalFromStorage: jest.fn(),
  }));
  
  describe('Journal Functions', () => {
    let mockFormData;
    let mockEntries;
  
    beforeEach(() => {
      // Clear the array and reset mocks
      journalArray.length = 0;
      jest.clearAllMocks();
  
      // Setup test data
      mockEntries = [
        { 
          id: '2023-01-01 12:00', 
          journal_detail_title: 'Happy Day', 
          journal_entry_textarea: 'Today was great!',
          journal_mood_dropdown: 'happy'
        },
        { 
          id: '2023-01-02 13:00', 
          journal_detail_title: 'Sad News', 
          journal_entry_textarea: 'Received bad news today',
          journal_mood_dropdown: 'sad'
        }
      ];
  
      // Initialize with test data
      journalArray.push(...mockEntries);
      
      // Mock FormData
      mockFormData = {
        entries: jest.fn().mockReturnValue([
          ['journal_detail_title', 'Test Title'],
          ['journal_entry_textarea', 'Test content'],
          ['journal_mood_dropdown', 'happy']
        ])
      };
    });
  
    describe('createJournalEntry', () => {
      it('should create a new journal entry with timestamp ID', () => {
        const result = createJournalEntry(mockFormData);
        
        expect(result.id).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
        expect(result.journal_detail_title).toBe('Test Title');
        expect(journalArray).toHaveLength(3); // 2 initial + 1 new
      });
    });
  
    describe('updateJournalEntry', () => {
      it('should update an existing entry', () => {
        const updatedFormData = {
          entries: jest.fn().mockReturnValue([
            ['journal_detail_title', 'Updated Title'],
            ['journal_entry_textarea', 'Updated content'],
            ['journal_mood_dropdown', 'motivated']
          ])
        };
        
        const result = updateJournalEntry('2023-01-01 12:00', updatedFormData);
        
        expect(result.journal_detail_title).toBe('Updated Title');
        expect(journalArray[0].journal_detail_title).toBe('Updated Title');
      });
  
      it('should return null for non-existent ID', () => {
        const result = updateJournalEntry('non-existent-id', mockFormData);
        expect(result).toBeNull();
      });
    });
  
    describe('deleteJournalEntry', () => {
      it('should remove an entry from journalArray', () => {
        const initialLength = journalArray.length;
        const result = deleteJournalEntry('2023-01-01 12:00');
        
        expect(result).toBe(true);
        expect(journalArray).toHaveLength(initialLength - 1);
      });
  
      it('should return false for non-existent ID', () => {
        const result = deleteJournalEntry('non-existent-id');
        expect(result).toBe(false);
      });
    });
  
    describe('searchJournals', () => {
      it('should find entries by title (case insensitive)', () => {
        const results = searchJournals('happy');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].journal_detail_title).toBe('Happy Day');
      });
  
      it('should find entries by content (case insensitive)', () => {
        const results = searchJournals('bad news');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].journal_entry_textarea).toBe('Received bad news today');
      });
  
      it('should return empty array for no matches', () => {
        const results = searchJournals('nonexistent term');
        expect(results).toEqual([]);
      });
    });
  
    describe('filterJournalsByMood', () => {
      it('should filter by mood', () => {
        const results = filterJournalsByMood('happy');
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].journal_mood_dropdown).toBe('happy');
      });
  
      it('should return empty array for non-existent mood', () => {
        const results = filterJournalsByMood('angry');
        expect(results).toEqual([]);
      });
    });
  });