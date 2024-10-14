const fs = require('fs');

function processOutput(outputFilePath, inputData) {
    const json = JSON.stringify(inputData, null, 2);
    fs.writeFileSync(outputFilePath, json, 'utf8');
}

module.exports = { processOutput };
