# JSON Formatter & Validator

A lightweight, client-side JSON formatter, validator, and CSV converter. No backend required - all processing happens directly in your browser.

## Features

- ✓ **JSON Validation** - Validate JSON with detailed error messages showing line and column numbers
- ✨ **JSON Formatting** - Beautify JSON with syntax highlighting and proper indentation
- 📊 **JSON to CSV Conversion** - Convert JSON arrays to CSV format for use in spreadsheets
- 🎨 **Clean UI** - Modern, responsive design with gradient background
- 🔒 **Privacy First** - 100% client-side processing - your data never leaves your browser
- 📋 **Copy to Clipboard** - Easy copy functionality for output
- 🎯 **Error Highlighting** - Precise error location with line and column information

## Technologies

- Pure HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- No dependencies or frameworks required

## Usage

### Validate JSON
1. Paste your JSON into the input area
2. Click "Validate JSON"
3. See validation results with detailed error messages if invalid

### Format JSON
1. Paste your JSON (even minified/ugly JSON)
2. Click "Format JSON"
3. Get beautifully formatted JSON with syntax highlighting

### Convert to CSV
1. Paste a JSON array or object
2. Click "Convert to CSV"
3. Get CSV output ready for Excel/Google Sheets

**Supported JSON structures for CSV conversion:**
- Array of objects: `[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]`
- Single object: `{"name": "John", "age": 30}` (will be converted to a single row)
- Nested objects: Automatically stringified in CSV

## How to Run

### Option 1: Direct Browser (Simplest)

Simply open `index.html` in any modern web browser. No server or build process required!

### Option 2: Docker (Recommended)

The easiest way to run the application with a proper web server:

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

Then visit `http://localhost:8080`

**Requirements:**
- Docker
- Docker Compose

### Option 3: Static File Server

You can serve it with any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Features Breakdown

### JSON Validation
- Uses native `JSON.parse()` for accurate validation
- Shows exact error position (line and column)
- Displays the problematic code line

### JSON Formatting
- Pretty prints with 2-space indentation
- Syntax highlighting for:
  - Keys (cyan)
  - Strings (green)
  - Numbers (yellow)
  - Booleans (orange)
  - Null values (red)

### CSV Conversion
- Automatically extracts all unique keys from objects
- Handles nested objects (converted to JSON strings)
- Properly escapes commas, quotes, and newlines
- Handles missing values gracefully

## File Structure

```
.
├── index.html           # Main HTML structure
├── styles.css           # All styling and responsive design
├── app.js               # All JavaScript functionality
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── .dockerignore        # Docker ignore file
└── README.md            # This file
```

## Micro SaaS Potential

This tool is perfect as a micro SaaS because:
- No backend infrastructure costs
- Can be hosted on free static hosting (GitHub Pages, Netlify, Vercel)
- Fast loading times (all files < 25KB total)
- Works offline after initial load
- Easy to add monetization (ads, premium features)

## Future Enhancement Ideas

- Download formatted JSON/CSV as files
- Upload JSON files
- Multiple theme options (dark/light mode)
- JSON minification
- JSON to XML conversion
- XML/YAML to JSON conversion
- Share formatted JSON via URL
- JSON Schema validation
- JSON diff tool

## License

Free to use and modify.

## Contributing

Feel free to fork and submit pull requests!
