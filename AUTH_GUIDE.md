# Authentication System Guide

## Overview

The Vocabulary Builder now includes a complete user authentication system. Each user has their own account with separate vocabulary collections. Your saved words are private to your account and will persist across browser sessions.

## Features

✅ **User Registration** - Create a new account with username and password  
✅ **User Login** - Sign in to access your vocabulary  
✅ **Secure Storage** - Each user's data is stored separately in browser localStorage  
✅ **Per-User Vocabularies** - Every user has their own saved words  
✅ **Auto-Migration** - Existing words are automatically migrated to your account  
✅ **Logout** - Secure logout with confirmation  
✅ **Session Persistence** - Stay logged in across page reloads  

## How to Use

### First Time Users

1. **Open the Application**
   - Navigate to `login.html` or any page (you'll be redirected to login)
   
2. **Register a New Account**
   - Click "Register here" on the login page
   - Enter a username (minimum 3 characters)
   - Enter a password (minimum 4 characters)
   - Confirm your password
   - Click "Register"
   
3. **Login**
   - After registration, you'll be redirected to the login form
   - Enter your username and password
   - Click "Sign In"
   
4. **Start Adding Words**
   - Once logged in, you'll see your username in the top right
   - Add vocabulary words as usual
   - All words are saved to your account

### Existing Users

1. **Login**
   - Open `login.html`
   - Enter your username and password
   - Click "Sign In"

2. **Access Your Words**
   - Your previously saved words will be loaded automatically
   - Navigate between "Add Words", "Saved Words", and "Practice Quiz"

3. **Logout**
   - Click the "Logout" button in the top right corner
   - Confirm logout when prompted

## Data Storage

### Structure

User data is stored in browser's localStorage using this structure:

```json
{
  "username": "john_doe",
  "password": "password123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "words": [
    {
      "id": "1234567890",
      "word": "Example",
      "meaning": "A thing characteristic of its kind",
      "translation": "Örnek",
      "example": "This is an example sentence.",
      "dateAdded": "2024-01-01T00:00:00.000Z",
      "timestamp": 1234567890,
      "status": "new"
    }
  ]
}
```

### Storage Keys

- `vocab_users` - Contains all user accounts and their data
- `vocab_current_user` - Contains the currently logged-in username

### Backward Compatibility

If you had words saved before the authentication system was added:
- On first login, your old words will be automatically migrated to your account
- The old localStorage data will be removed after successful migration

## JSON File Template

A `users.json` file is included as a reference template showing the data structure. The actual data is stored in browser's localStorage, not in this file.

**Note:** Browsers cannot directly read/write to local JSON files due to security restrictions. The localStorage approach is the standard solution for client-side data persistence.

## Export & Import

### Export Your Data

You can export your vocabulary data from the main application:
1. Click "📤 Export Words" button
2. A JSON file will be downloaded with your vocabulary
3. This file includes all your saved words with timestamps

### Export User Data (Via Console)

To export complete user data including account info:
```javascript
const auth = new AuthSystem();
auth.exportUserData();
```

### Export All Users (Via Console)

To export all user accounts (useful for backup):
```javascript
const auth = new AuthSystem();
auth.exportAllUsersData();
```

## Security Notes

⚠️ **Important:** This is a client-side authentication system designed for personal use and learning purposes.

**Current Implementation:**
- Passwords are stored in plain text in localStorage
- No server-side validation
- No encryption
- Data is stored locally in the browser

**For Production Use:**
You would need to implement:
- Server-side authentication
- Password hashing (bcrypt, argon2, etc.)
- HTTPS/TLS encryption
- JWT tokens or session management
- Database storage
- Rate limiting
- Password reset functionality
- Email verification

## Troubleshooting

### Can't Login

- Verify your username and password are correct
- Username is case-sensitive
- Check browser console for error messages

### Lost Words After Login

- Make sure you're logging in with the correct account
- Check if migration happened by opening browser console
- Try exporting/importing your backup if available

### Multiple Users on Same Computer

- Each browser profile has separate localStorage
- Users can share the same computer by using different browser profiles
- Or simply logout and login with different credentials

### Clear All Data

To reset everything (including all accounts):
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Find localStorage for your site
4. Delete `vocab_users` and `vocab_current_user` keys
5. Refresh the page

## Technical Details

### Files Added

1. **login.html** - Login and registration page
2. **auth.js** - Authentication system class
3. **users.json** - Data structure template
4. **AUTH_GUIDE.md** - This documentation file

### Files Modified

1. **index.html** - Added auth check, user display, logout button
2. **saved_words.html** - Added auth check, user display, logout button
3. **script.js** - Modified to use user-specific storage
4. **style.css** - Already had authentication styles

### API Reference

**AuthSystem Class Methods:**

- `register(username, password)` - Register new user
- `login(username, password)` - Login user
- `logout()` - Logout and redirect to login
- `isLoggedIn()` - Check if user is logged in
- `getCurrentUser()` - Get current user object
- `getCurrentUsername()` - Get current username string
- `getUserWords(username)` - Get user's vocabulary words
- `saveUserWords(words, username)` - Save user's vocabulary words
- `migrateOldWords()` - Migrate pre-auth words to user account
- `exportUserData()` - Export user data as JSON file
- `exportAllUsersData()` - Export all users as JSON file

## Future Enhancements

Possible improvements for the authentication system:

- [ ] Password strength indicator
- [ ] Password reset functionality
- [ ] User profile page with statistics
- [ ] Account deletion option
- [ ] Remember me functionality
- [ ] Social login integration
- [ ] Multi-device sync (requires backend)
- [ ] Shared vocabulary lists between users
- [ ] User avatars and customization

## Support

If you encounter any issues or have questions:

1. Check this documentation
2. Review the browser console for error messages
3. Verify your browser supports localStorage
4. Try clearing browser cache and localStorage
5. Check the `users.json` template for data structure reference

---

**Version:** 1.0.0  
**Last Updated:** October 2024  
**Compatible With:** Modern browsers (Chrome, Firefox, Safari, Edge)

