const fs = require('fs');

function processOutput(outputFilePath, inputData) {
    // Konwertuj dane na format CSV i zapisz do pliku
    const data = inputData.map(row => Object.values(row).join(',')).join('\n');
    fs.writeFileSync(outputFilePath, data, 'utf8');
}

module.exports = { processOutput };
