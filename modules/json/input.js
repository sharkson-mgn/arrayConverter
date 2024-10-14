const fs = require('fs');

function processInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

module.exports = { processInput };
