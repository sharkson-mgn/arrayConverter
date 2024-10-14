const fs = require('fs');

// Funkcja do konwertowania obiektów JSON na format PHP
function convertJsonToPhp(data) {
    function escapePhpString(str) {
        return `'${str.replace(/'/g, "\\'")}'`;
    }

    function convertValue(value, indentLevel = 0) {
        const indent = '    '.repeat(indentLevel);
        if (Array.isArray(value)) {
            const arrayElements = value.map(val => convertValue(val, indentLevel + 1));
            return `[\n${arrayElements.join(',\n')}\n${indent}]`;
        } else if (typeof value === 'object' && value !== null) {
            const objectEntries = Object.entries(value).map(([key, val]) => {
                const keyStr = escapePhpString(key);
                const valueStr = convertValue(val, indentLevel + 1);
                return `${indent}${keyStr} => ${valueStr}`;
            });
            return `[\n${objectEntries.join(",\n")}\n${indent}]`;
        } else {
            return escapePhpString(value.toString());
        }
    }

    return `<?php\n\nreturn ${convertValue(data)};\n`;
}

function processOutput(filePath, data) {
    // Konwertowanie obiektów JSON na format PHP
    const phpData = convertJsonToPhp(data);

    // Zapis do pliku PHP
    fs.writeFileSync(filePath, phpData, 'utf8');
}

module.exports = { processOutput };
