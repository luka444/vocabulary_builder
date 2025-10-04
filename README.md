# Vocabulary Builder

A beautiful and functional vocabulary building website built with vanilla HTML, CSS, and JavaScript. Store and manage your vocabulary words with meanings, translations, and examples.

## Features

- ✅ **Add Words**: Add new vocabulary words with meanings, translations, and examples
- ✅ **Persistent Storage**: All data is saved locally in your browser using localStorage
- ✅ **Search & Filter**: Search through your vocabulary and sort by different criteria
- ✅ **Beautiful UI**: Modern, responsive design with smooth animations
- ✅ **Edit & Delete**: Modify or remove words from your vocabulary
- ✅ **Export/Import**: Backup and restore your vocabulary data
- ✅ **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## How to Use

1. **Adding Words**: Fill in the form on the left side with:
   - Word (required)
   - Meaning (required)
   - Translation (optional)
   - Example sentence (optional)

2. **Searching**: Use the search box to find specific words by any field

3. **Sorting**: Choose from different sorting options:
   - Newest First
   - Oldest First
   - A-Z Alphabetical
   - Z-A Reverse

4. **Managing Words**: 
   - Click "Edit" to modify a word
   - Click "Delete" to remove a word

## Technical Details

- **Storage**: Uses browser localStorage for persistent data
- **Data Format**: JSON structure for each vocabulary entry
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required
- **Cross-browser**: Works on all modern browsers

## File Structure

```
project_67/
├── index.html          # Main HTML structure
├── style.css           # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Data Structure

Each vocabulary entry is stored as:

```json
{
  "id": "unique_identifier",
  "word": "Vocabulary word",
  "meaning": "Definition or meaning",
  "translation": "Translation in another language",
  "example": "Example sentence",
  "dateAdded": "ISO date string",
  "timestamp": "Unix timestamp"
}
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save vocabulary (manual save)
- `Escape`: Clear search when focused on search input

## Future Enhancements

- Categories/Tags for words
- Spaced repetition system
- Quiz/Test functionality
- Cloud sync capabilities
- Multiple language support
- Word statistics and progress tracking

---

**Note**: This is a client-side application. All data is stored locally in your browser. To backup your vocabulary, use the export functionality in the browser console.
