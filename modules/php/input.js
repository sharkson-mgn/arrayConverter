const fs = require('fs');

// Funkcja do konwertowania obiektów JSON na format PHP
function convertJsonToPhpObject(data) {
    function convertValue(value) {
        if (Array.isArray(value)) {
            return value.map(convertValue);
        } else if (typeof value === 'object' && value !== null) {
            return Object.fromEntries(
                Object.entries(value).map(([key, val]) => [key, convertValue(val)])
            );
        } else {
            return value;
        }
    }

    return convertValue(data);
}

function processInput(filePath) {
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Konwertowanie danych JSON na format PHP
    const phpData = convertJsonToPhpObject(jsonData);

    return phpData;
}

module.exports = { processInput };
