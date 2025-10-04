// Vocabulary Builder Application
class VocabularyBuilder {
    constructor() {
        this.words = this.loadWords();
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentPage = 'builder';
        this.quizCount = this.loadQuizCount();
        this.currentQuizWord = null;
        this.quizActive = false;
        this.initializeApp();
    }

    // Initialize the application
    initializeApp() {
        this.bindEvents();
        this.updateWordCount();
        this.updateQuizStats();
    }

    // Bind event listeners
    bindEvents() {
        // Form submission
        document.getElementById('wordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addWord();
        });

        // Search functionality for saved words (only if element exists)
        const savedSearchInput = document.getElementById('savedSearchInput');
        if (savedSearchInput) {
            savedSearchInput.addEventListener('input', (e) => {
                this.filterSavedWords(e.target.value);
            });

            savedSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        }

        // Sort functionality for saved words (only if element exists)
        const savedSortSelect = document.getElementById('savedSortSelect');
        if (savedSortSelect) {
            savedSortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderSavedWords();
            });
        }

        // Navigation (only for nav buttons with data-page attribute)
        document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPage(e.target.dataset.page);
            });
        });

        // Quiz functionality (only if elements exist)
        const startQuizBtn = document.getElementById('startQuizBtn');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }

        const showAnswerBtn = document.getElementById('showAnswerBtn');
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => {
                this.showAnswer();
            });
        }

        const nextWordBtn = document.getElementById('nextWordBtn');
        if (nextWordBtn) {
            nextWordBtn.addEventListener('click', () => {
                this.nextWord();
            });
        }

        const resetQuizBtn = document.getElementById('resetQuizBtn');
        if (resetQuizBtn) {
            resetQuizBtn.addEventListener('click', () => {
                this.resetQuiz();
            });
        }
    }

    // Add a new word to the vocabulary
    addWord() {
        const form = document.getElementById('wordForm');
        const formData = new FormData(form);
        
        const wordData = {
            id: Date.now().toString(),
            word: formData.get('word').trim(),
            meaning: formData.get('meaning').trim(),
            translation: formData.get('translation').trim(),
            example: formData.get('example').trim(),
            dateAdded: new Date().toISOString(),
            timestamp: Date.now(),
            status: 'new' // Default status for new words
        };

        // Validate required fields
        if (!wordData.word || !wordData.meaning) {
            this.showMessage('Please fill in at least the word and meaning fields.', 'error');
            return;
        }

        // Check for duplicates
        if (this.words.some(w => w.word.toLowerCase() === wordData.word.toLowerCase())) {
            this.showMessage('This word already exists in your vocabulary!', 'error');
            return;
        }

        // Add word to array
        this.words.unshift(wordData); // Add to beginning for newest first
        
        // Save to localStorage
        this.saveWords();
        
        // Clear form
        form.reset();
        
        // Re-render saved words if on saved page (for single page app)
        if (this.currentPage === 'saved') {
            this.renderSavedWords();
        }
        
        // Update word count
        this.updateWordCount();
        this.updateQuizStats();
        
        // Show success message
        this.showMessage('Word added successfully!', 'success');
    }

    // Filter saved words based on search term
    filterSavedWords(searchTerm) {
        const filteredWords = this.words.filter(word => {
            const searchLower = searchTerm.toLowerCase();
            return (
                word.word.toLowerCase().includes(searchLower) ||
                word.meaning.toLowerCase().includes(searchLower) ||
                word.translation.toLowerCase().includes(searchLower) ||
                word.example.toLowerCase().includes(searchLower)
            );
        });
        
        this.renderSavedWords(filteredWords);
    }

    // Sort words based on current sort option
    sortWords(words) {
        const wordsToSort = [...words];
        
        switch (this.currentSort) {
            case 'newest':
                return wordsToSort.sort((a, b) => b.timestamp - a.timestamp);
            case 'oldest':
                return wordsToSort.sort((a, b) => a.timestamp - b.timestamp);
            case 'alphabetical':
                return wordsToSort.sort((a, b) => a.word.localeCompare(b.word));
            case 'reverse':
                return wordsToSort.sort((a, b) => b.word.localeCompare(a.word));
            default:
                return wordsToSort;
        }
    }

    // Render saved words to the DOM
    renderSavedWords(wordsToRender = null) {
        const container = document.getElementById('savedWordsContainer');
        const words = wordsToRender || this.words;
        const sortedWords = this.sortWords(words);

        if (sortedWords.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No words found. ${wordsToRender ? 'Try adjusting your search.' : 'No words saved yet. Start adding words to build your vocabulary!'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = sortedWords.map(word => this.createWordCard(word)).join('');
        
        // Add event listeners to delete buttons
        this.bindDeleteEvents();
    }

    // Create HTML for a word card
    createWordCard(word) {
        const date = new Date(word.dateAdded).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="word-card" data-id="${word.id}">
                <div class="word-header">
                    <div>
                        <div class="word-title">${this.escapeHtml(word.word)}</div>
                        ${word.translation ? `<div class="word-translation">${this.escapeHtml(word.translation)}</div>` : ''}
                        <div class="word-date">Added on ${date}</div>
                    </div>
                </div>
                
                <div class="word-meaning">${this.escapeHtml(word.meaning)}</div>
                
                ${word.example ? `<div class="word-example">${this.escapeHtml(word.example)}</div>` : ''}
                
                <div class="word-actions">
                    <button class="btn btn-secondary edit-btn" data-id="${word.id}">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${word.id}">Delete</button>
                </div>
            </div>
        `;
    }

    // Bind delete button events
    bindDeleteEvents() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wordId = e.target.dataset.id;
                this.deleteWord(wordId);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const wordId = e.target.dataset.id;
                this.editWord(wordId);
            });
        });
    }

    // Delete a word
    deleteWord(wordId) {
        if (confirm('Are you sure you want to delete this word?')) {
            this.words = this.words.filter(word => word.id !== wordId);
            this.saveWords();
            this.renderSavedWords();
            this.updateWordCount();
            this.updateQuizStats();
            this.showMessage('Word deleted successfully!', 'success');
        }
    }

    // Edit a word
    editWord(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return;

        // Fill form with existing data
        document.getElementById('word').value = word.word;
        document.getElementById('meaning').value = word.meaning;
        document.getElementById('translation').value = word.translation;
        document.getElementById('example').value = word.example;

        // Remove the word from the list temporarily
        this.words = this.words.filter(w => w.id !== wordId);
        this.saveWords();
        this.renderSavedWords();
        this.updateWordCount();
        this.updateQuizStats();

        // Switch to main page for editing
        window.location.href = 'index.html';

        // Focus on the word input
        document.getElementById('word').focus();
        
        this.showMessage('Word loaded for editing. Make your changes and submit.', 'info');
    }

    // Switch between pages
    switchPage(page) {
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show/hide pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}Page`).classList.add('active');

        this.currentPage = page;

        // Update stats when switching pages
        if (page === 'quiz') {
            this.updateQuizStats();
        }
    }

    // Start the quiz
    startQuiz() {
        if (this.words.length === 0) {
            this.showMessage('Please add some words first before starting the quiz!', 'error');
            return;
        }

        this.quizActive = true;
        document.getElementById('startQuizBtn').disabled = true;
        document.getElementById('startQuizBtn').textContent = 'Quiz Active';
        document.getElementById('showAnswerBtn').disabled = false;
        document.getElementById('nextWordBtn').disabled = false;
        
        this.generateRandomWord();
    }

    // Generate a random word for the quiz
    generateRandomWord() {
        if (this.words.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.currentQuizWord = this.words[randomIndex];

        // Display the word
        document.getElementById('quizWord').textContent = this.currentQuizWord.word;
        
        // Hide the answer
        document.getElementById('quizAnswer').classList.add('hidden');
        
        // Reset button states
        document.getElementById('showAnswerBtn').textContent = 'Show Information';
        document.getElementById('nextWordBtn').textContent = 'Next Word';
    }

    // Show the answer for the current quiz word
    showAnswer() {
        if (!this.currentQuizWord) return;

        // Update answer content
        document.getElementById('quizMeaning').textContent = this.currentQuizWord.meaning;
        
        // Show translation if available
        if (this.currentQuizWord.translation) {
            document.getElementById('quizTranslation').textContent = this.currentQuizWord.translation;
            document.getElementById('quizTranslationItem').style.display = 'block';
        } else {
            document.getElementById('quizTranslationItem').style.display = 'none';
        }
        
        // Show example if available
        if (this.currentQuizWord.example) {
            document.getElementById('quizExample').textContent = this.currentQuizWord.example;
            document.getElementById('quizExampleItem').style.display = 'block';
        } else {
            document.getElementById('quizExampleItem').style.display = 'none';
        }

        // Show the answer with animation
        document.getElementById('quizAnswer').classList.remove('hidden');
        
        // Update button
        document.getElementById('showAnswerBtn').textContent = 'Hide Information';
        document.getElementById('showAnswerBtn').onclick = () => this.hideAnswer();
    }

    // Hide the answer
    hideAnswer() {
        document.getElementById('quizAnswer').classList.add('hidden');
        document.getElementById('showAnswerBtn').textContent = 'Show Information';
        document.getElementById('showAnswerBtn').onclick = () => this.showAnswer();
    }

    // Move to the next word
    nextWord() {
        if (!this.quizActive) return;

        this.quizCount++;
        this.saveQuizCount();
        this.updateQuizStats();
        
        this.generateRandomWord();
    }

    // Reset quiz progress
    resetQuiz() {
        if (confirm('Are you sure you want to reset your quiz progress?')) {
            this.quizCount = 0;
            this.saveQuizCount();
            this.quizActive = false;
            this.currentQuizWord = null;
            
            document.getElementById('startQuizBtn').disabled = false;
            document.getElementById('startQuizBtn').textContent = 'Start Quiz';
            document.getElementById('showAnswerBtn').disabled = true;
            document.getElementById('nextWordBtn').disabled = true;
            document.getElementById('showAnswerBtn').textContent = 'Show Information';
            document.getElementById('showAnswerBtn').onclick = () => this.showAnswer();
            
            document.getElementById('quizWord').textContent = 'Add some words first!';
            document.getElementById('quizAnswer').classList.add('hidden');
            
            this.updateQuizStats();
            this.showMessage('Quiz progress reset!', 'success');
        }
    }

    // Update quiz statistics
    updateQuizStats() {
        document.getElementById('totalWords').textContent = this.words.length;
        document.getElementById('quizCount').textContent = this.quizCount;
    }

    // Load quiz count from localStorage
    loadQuizCount() {
        try {
            const savedCount = localStorage.getItem('vocabularyQuizCount');
            return savedCount ? parseInt(savedCount) : 0;
        } catch (error) {
            console.error('Error loading quiz count:', error);
            return 0;
        }
    }

    // Save quiz count to localStorage
    saveQuizCount() {
        try {
            localStorage.setItem('vocabularyQuizCount', this.quizCount.toString());
        } catch (error) {
            console.error('Error saving quiz count:', error);
        }
    }

    // Update word count display
    updateWordCount() {
        const header = document.querySelector('.header p');
        const count = this.words.length;
        header.textContent = `Build your vocabulary one word at a time (${count} words saved)`;
    }

    // Show message to user
    showMessage(message, type = 'success') {
        // Remove existing message
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `success-message ${type}`;
        messageDiv.textContent = message;
        
        // Style based on type
        if (type === 'error') {
            messageDiv.style.background = '#fc8181';
        } else if (type === 'info') {
            messageDiv.style.background = '#4299e1';
        }

        document.body.appendChild(messageDiv);

        // Show message
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);

        // Hide message after 3 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Save words to localStorage
    saveWords() {
        try {
            localStorage.setItem('vocabularyWords', JSON.stringify(this.words));
        } catch (error) {
            console.error('Error saving words:', error);
            this.showMessage('Error saving words to storage!', 'error');
        }
    }

    // Load words from localStorage
    loadWords() {
        try {
            const savedWords = localStorage.getItem('vocabularyWords');
            return savedWords ? JSON.parse(savedWords) : [];
        } catch (error) {
            console.error('Error loading words:', error);
            this.showMessage('Error loading words from storage!', 'error');
            return [];
        }
    }

    // Initialize saved words page
    initializeSavedWordsPage() {
        this.renderSavedWords();
        this.updateWordCount();
        this.updateQuizStats();
    }

    // Export words as JSON
    exportWords() {
        if (this.words.length === 0) {
            this.showMessage('No words to export!', 'error');
            return;
        }

        const dataStr = JSON.stringify(this.words, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vocabulary-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage(`Exported ${this.words.length} words successfully!`, 'success');
    }

    // Import words from JSON file
    importWords(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedWords = JSON.parse(e.target.result);
                if (Array.isArray(importedWords)) {
                    // Check if user wants to replace or merge
                    const shouldReplace = confirm(
                        `Import ${importedWords.length} words?\n\n` +
                        'OK = Replace all current words\n' +
                        'Cancel = Add to existing words'
                    );
                    
                    if (shouldReplace) {
                        // Replace all words
                        this.words = importedWords.map(word => ({
                            ...word,
                            id: word.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            dateAdded: word.dateAdded || new Date().toISOString(),
                            timestamp: word.timestamp || Date.now(),
                            status: word.status || 'new'
                        }));
                    } else {
                        // Merge with existing words
                        const newWords = importedWords.map(word => ({
                            ...word,
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            dateAdded: new Date().toISOString(),
                            timestamp: Date.now(),
                            status: word.status || 'new'
                        }));
                        
                        this.words = [...newWords, ...this.words];
                    }
                    
                    this.saveWords();
                    this.renderSavedWords();
                    this.updateWordCount();
                    this.showMessage(`Successfully imported ${importedWords.length} words!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showMessage('Error importing words. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vocabularyApp = new VocabularyBuilder();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save (prevent default browser save)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (window.vocabularyApp) {
                window.vocabularyApp.saveWords();
                window.vocabularyApp.showMessage('Words saved!', 'success');
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (searchInput === document.activeElement) {
                searchInput.value = '';
                window.vocabularyApp.renderWords();
            }
        }
    });

    // Add export/import functionality (can be added to UI later)
    window.exportVocabulary = () => {
        if (window.vocabularyApp) {
            window.vocabularyApp.exportWords();
        }
    };

    window.importVocabulary = (file) => {
        if (window.vocabularyApp && file) {
            window.vocabularyApp.importWords(file);
        }
    };
});
