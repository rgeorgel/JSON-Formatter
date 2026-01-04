// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const output = document.getElementById('output');
const errorBox = document.getElementById('error');
const outputType = document.getElementById('outputType');

const validateBtn = document.getElementById('validateBtn');
const formatBtn = document.getElementById('formatBtn');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

// State
let currentOutput = '';
let currentOutputFormat = 'json';

// Event Listeners
validateBtn.addEventListener('click', validateJSON);
formatBtn.addEventListener('click', formatJSON);
convertBtn.addEventListener('click', convertToCSV);
copyBtn.addEventListener('click', copyOutput);
clearBtn.addEventListener('click', clearAll);

// Validate JSON
function validateJSON() {
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter some JSON to validate');
        return;
    }

    try {
        JSON.parse(input);
        hideError();
        showSuccess('✓ Valid JSON!');
        outputType.textContent = 'Validation Result';
        currentOutput = '';
        currentOutputFormat = 'validation';
    } catch (error) {
        showJSONError(error, input);
    }
}

// Format JSON
function formatJSON() {
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter some JSON to format');
        return;
    }

    try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        const highlighted = syntaxHighlight(formatted);

        hideError();
        output.innerHTML = highlighted;
        currentOutput = formatted;
        currentOutputFormat = 'json';
        outputType.textContent = 'Formatted JSON';
    } catch (error) {
        showJSONError(error, input);
    }
}

// Convert JSON to CSV
function convertToCSV() {
    const input = jsonInput.value.trim();

    if (!input) {
        showError('Please enter some JSON to convert');
        return;
    }

    try {
        const parsed = JSON.parse(input);

        // Handle different JSON structures
        let data;
        if (Array.isArray(parsed)) {
            data = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
            // If it's a single object, wrap it in an array
            data = [parsed];
        } else {
            showError('JSON must be an object or array of objects to convert to CSV');
            return;
        }

        if (data.length === 0) {
            showError('JSON array is empty');
            return;
        }

        // Convert to CSV
        const csv = jsonToCSV(data);
        hideError();
        output.textContent = csv;
        currentOutput = csv;
        currentOutputFormat = 'csv';
        outputType.textContent = 'CSV Output';
    } catch (error) {
        showJSONError(error, input);
    }
}

// JSON to CSV conversion helper
function jsonToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }

    // Get all unique keys from all objects
    const keys = new Set();
    data.forEach(item => {
        if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => keys.add(key));
        }
    });

    const headers = Array.from(keys);

    // Create CSV header
    const csvRows = [];
    csvRows.push(headers.map(escapeCSV).join(','));

    // Create CSV rows
    data.forEach(item => {
        const values = headers.map(header => {
            let value = '';
            if (typeof item === 'object' && item !== null) {
                value = item[header];

                // Handle nested objects/arrays
                if (typeof value === 'object' && value !== null) {
                    value = JSON.stringify(value);
                }

                // Handle undefined/null
                if (value === undefined || value === null) {
                    value = '';
                }
            }
            return escapeCSV(String(value));
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

// Escape CSV values
function escapeCSV(value) {
    if (value === undefined || value === null) {
        return '';
    }

    const stringValue = String(value);

    // If the value contains comma, newline, or quotes, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

// Syntax highlighting for JSON
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';

        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }

        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Show JSON parsing errors
function showJSONError(error, input) {
    const errorMessage = error.message;
    let errorHTML = `<h4>Invalid JSON</h4>`;
    errorHTML += `<p>${errorMessage}</p>`;

    // Try to extract position information
    const posMatch = errorMessage.match(/position (\d+)/);
    if (posMatch) {
        const position = parseInt(posMatch[1]);
        const lines = input.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        errorHTML += `<div class="error-details">Error at line ${line}, column ${column}</div>`;

        // Show the problematic line
        const allLines = input.split('\n');
        if (allLines[line - 1]) {
            errorHTML += `<div class="error-details">`;
            errorHTML += `<br><strong>Problematic line:</strong><br>`;
            errorHTML += `${line}: ${escapeHTML(allLines[line - 1])}<br>`;
            errorHTML += `${' '.repeat(String(line).length + 2 + column - 1)}^`;
            errorHTML += `</div>`;
        }
    }

    errorBox.innerHTML = errorHTML;
    errorBox.classList.remove('hidden');
    output.textContent = '';
    outputType.textContent = '';
    currentOutput = '';
}

// Show generic error
function showError(message) {
    errorBox.innerHTML = `<h4>Error</h4><p>${message}</p>`;
    errorBox.classList.remove('hidden');
    output.textContent = '';
    outputType.textContent = '';
    currentOutput = '';
}

// Hide error
function hideError() {
    errorBox.classList.add('hidden');
}

// Show success message
function showSuccess(message) {
    output.innerHTML = `<div class="success-message">${message}</div>`;
}

// Copy output to clipboard
function copyOutput() {
    if (!currentOutput) {
        showNotification('Nothing to copy!', false);
        return;
    }

    navigator.clipboard.writeText(currentOutput).then(() => {
        showNotification('Copied to clipboard!', true);
    }).catch(err => {
        showNotification('Failed to copy', false);
    });
}

// Clear all
function clearAll() {
    jsonInput.value = '';
    output.textContent = '';
    outputType.textContent = '';
    currentOutput = '';
    hideError();
}

// Show notification
function showNotification(message, isSuccess) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    notification.style.background = isSuccess ? 'var(--success-color)' : 'var(--danger-color)';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Escape HTML
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Sample JSON for quick testing (optional - can be removed)
const sampleJSON = {
    "users": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "age": 25
        }
    ],
    "total": 2
};

// Load sample on first visit (optional)
if (!localStorage.getItem('visited')) {
    jsonInput.value = JSON.stringify(sampleJSON, null, 2);
    localStorage.setItem('visited', 'true');
}
