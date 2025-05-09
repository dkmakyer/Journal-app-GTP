import {
    journalArray,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    searchJournals,
    filterJournalsByMood,
  } from '../scripts/journal';
  
  describe('Journal Functions', () => {
    let mockFormData;
    let mockEntries;
  
    beforeEach(() => {      
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

      journalArray.push(...mockEntries);
      
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
        expect(journalArray).toHaveLength(3);
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
      it('should delete an entry and return true', () => {
        const initialLength = journalArray.length;
        const result = deleteJournalEntry('2023-01-01 12:00');
        
        expect(result).toBe(true);
        expect(journalArray).toHaveLength(initialLength - 1);
        expect(saveJournalsToStorage).toHaveBeenCalled();
        expect(removeJournalFromStorage).toHaveBeenCalledWith('2023-01-01 12:00');
      });
  
      it('should return false for non-existent ID', () => {
        const result = deleteJournalEntry('non-existent-id');
        expect(result).toBe(false);
      });
    });
  
    describe('searchJournals', () => {
      it('should search by title', () => {
        const results = searchJournals('happy day');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('2023-01-01 12:00');
      });
  
      it('should search by content', () => {
        const results = searchJournals('bad news');
        expect(results).toHaveLength(1);
        expect(results[0].id).toBe('2023-01-02 13:00');
      });
  
      it('should return empty array for no matches', () => {
        const results = searchJournals('non-existent term');
        expect(results).toHaveLength(0);
      });
    });
  
    describe('filterJournalsByMood', () => {
      it('should filter by mood', () => {
        const results = filterJournalsByMood('happy');
        expect(results).toHaveLength(1);
        expect(results[0].journal_mood_dropdown).toBe('happy');
      });
  
      it('should return empty array for non-existent mood', () => {
        const results = filterJournalsByMood('angry');
        expect(results).toHaveLength(0);
      });
    });
  });