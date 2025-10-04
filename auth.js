// User Authentication System
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.initializeAuth();
    }

    // Initialize authentication system
    initializeAuth() {
        this.bindAuthEvents();
        this.checkExistingSession();
    }

    // Bind authentication event listeners
    bindAuthEvents() {
        // Login form
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Form switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
    }

    // Check if user is already logged in
    checkExistingSession() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            // Only redirect if we're on the login page
            if (window.location.pathname.includes('login.html')) {
                this.redirectToApp();
            }
        }
    }

    // Handle user login
    handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const user = this.users.find(u => u.username === username);
        if (!user) {
            this.showMessage('User not found', 'error');
            return;
        }

        if (user.password !== password) {
            this.showMessage('Incorrect password', 'error');
            return;
        }

        // Login successful
        this.currentUser = user;
        this.saveCurrentUser();
        this.showMessage('Login successful!', 'success');
        
        setTimeout(() => {
            this.redirectToApp();
        }, 1000);
    }

    // Handle user registration
    handleRegister() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!username || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        // Check if username already exists
        if (this.users.find(u => u.username === username)) {
            this.showMessage('Username already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username: username,
            password: password,
            words: [],
            quizCount: 0,
            dateCreated: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        
        this.currentUser = newUser;
        this.saveCurrentUser();
        
        this.showMessage('Account created successfully!', 'success');
        
        setTimeout(() => {
            this.redirectToApp();
        }, 1000);
    }

    // Show register form
    showRegisterForm() {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        this.clearForms();
    }

    // Show login form
    showLoginForm() {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        this.clearForms();
    }

    // Clear all form inputs
    clearForms() {
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    // Redirect to main application
    redirectToApp() {
        window.location.href = 'main.html';
    }

    // Save users to localStorage
    saveUsers() {
        try {
            localStorage.setItem('vocabularyUsers', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users:', error);
            this.showMessage('Error saving user data!', 'error');
        }
    }

    // Load users from localStorage
    loadUsers() {
        try {
            const savedUsers = localStorage.getItem('vocabularyUsers');
            return savedUsers ? JSON.parse(savedUsers) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            this.showMessage('Error loading user data!', 'error');
            return [];
        }
    }

    // Save current user session
    saveCurrentUser() {
        try {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user data
    updateUser(userData) {
        if (!this.currentUser) return;

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...userData };
            this.currentUser = this.users[userIndex];
            this.saveUsers();
            this.saveCurrentUser();
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
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
        
        // Style based on type
        if (type === 'error') {
            messageDiv.style.background = '#fc8181';
        } else {
            messageDiv.style.background = '#48bb78';
        }

        document.querySelector('.auth-container').appendChild(messageDiv);

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
}

// Initialize user manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new UserManager();
});
