// Authentication System
class AuthSystem {
    constructor() {
        this.USERS_KEY = 'vocab_users';
        this.CURRENT_USER_KEY = 'vocab_current_user';
        this.initializeStorage();
    }

    // Initialize storage with default structure if needed
    initializeStorage() {
        const users = localStorage.getItem(this.USERS_KEY);
        if (!users) {
            // Initialize with empty users object
            localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
        }
    }

    // Get all users from localStorage
    getUsers() {
        try {
            const users = localStorage.getItem(this.USERS_KEY);
            return users ? JSON.parse(users) : {};
        } catch (error) {
            console.error('Error loading users:', error);
            return {};
        }
    }

    // Save users to localStorage
    saveUsers(users) {
        try {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    // Register a new user
    register(username, password) {
        // Validate inputs
        if (!username || username.length < 3) {
            return {
                success: false,
                message: 'Username must be at least 3 characters long!'
            };
        }

        if (!password || password.length < 4) {
            return {
                success: false,
                message: 'Password must be at least 4 characters long!'
            };
        }

        const users = this.getUsers();

        // Check if username already exists
        if (users[username]) {
            return {
                success: false,
                message: 'Username already exists! Please choose a different username.'
            };
        }

        // Create new user
        users[username] = {
            username: username,
            password: password, // In a real app, this should be hashed!
            createdAt: new Date().toISOString(),
            words: [] // Each user has their own words array
        };

        // Save users
        if (this.saveUsers(users)) {
            return {
                success: true,
                message: 'Registration successful!'
            };
        } else {
            return {
                success: false,
                message: 'Error saving user data. Please try again.'
            };
        }
    }

    // Login user
    login(username, password) {
        const users = this.getUsers();
        const user = users[username];

        // Check if user exists and password matches
        if (user && user.password === password) {
            // Set current user
            localStorage.setItem(this.CURRENT_USER_KEY, username);
            return true;
        }

        return false;
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    isLoggedIn() {
        const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
        return currentUser !== null && currentUser !== '';
    }

    // Get current logged-in user
    getCurrentUser() {
        const username = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!username) return null;

        const users = this.getUsers();
        return users[username] || null;
    }

    // Get current username
    getCurrentUsername() {
        return localStorage.getItem(this.CURRENT_USER_KEY);
    }

    // Get user's words
    getUserWords(username = null) {
        const user = username ? this.getUsers()[username] : this.getCurrentUser();
        return user ? user.words : [];
    }

    // Save user's words
    saveUserWords(words, username = null) {
        const targetUsername = username || this.getCurrentUsername();
        if (!targetUsername) return false;

        const users = this.getUsers();
        if (!users[targetUsername]) return false;

        users[targetUsername].words = words;
        return this.saveUsers(users);
    }

    // Migrate old localStorage words to current user (for backward compatibility)
    migrateOldWords() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        // Check if user already has words
        if (currentUser.words && currentUser.words.length > 0) {
            return; // User already has words, don't migrate
        }

        // Get old words from localStorage
        const oldWords = localStorage.getItem('vocabularyWords');
        if (oldWords) {
            try {
                const words = JSON.parse(oldWords);
                if (words && words.length > 0) {
                    // Save to current user
                    this.saveUserWords(words);
                    // Remove old words
                    localStorage.removeItem('vocabularyWords');
                    console.log('Migrated old words to user account');
                }
            } catch (error) {
                console.error('Error migrating old words:', error);
            }
        }
    }

    // Show message to user
    showMessage(message, type = 'success') {
        // Remove existing message
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;

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

    // Export user data as JSON file
    exportUserData() {
        const user = this.getCurrentUser();
        if (!user) return;

        const userData = {
            username: user.username,
            createdAt: user.createdAt,
            words: user.words,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vocabulary-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Export all users data (admin function)
    exportAllUsersData() {
        const users = this.getUsers();
        const dataStr = JSON.stringify(users, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `vocabulary-all-users-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Make AuthSystem available globally
window.AuthSystem = AuthSystem;

