const fs = require('fs');
const iconv = require('iconv-lite');
const { parse } = require('csv-parse/sync');
const jschardet = require('jschardet');

// Funkcja do wykrywania delimiterów
function detectDelimiter(headerLine) {
    const delimiters = [',', ';', '\t', '|'];
    const delimiterCounts = delimiters.map(delimiter => ({
        delimiter,
        count: (headerLine.split(delimiter).length - 1)
    }));

    // Sortujemy po liczbie wystąpień w malejącej kolejności
    delimiterCounts.sort((a, b) => b.count - a.count);

    // Zwracamy delimiter o największej liczbie wystąpień
    return delimiterCounts[0].delimiter;
}

// Funkcja do wykrywania kodowania pliku
function detectFileEncoding(filePath) {
    const buffer = fs.readFileSync(filePath, { encoding: null, start: 0, end: 4096 });
    const detection = jschardet.detect(buffer);
    return detection.encoding.toLowerCase();
}

function processInput(filePath) {
    const encoding = detectFileEncoding(filePath);

    // Używamy iconv-lite do konwersji na UTF-8
    const data = iconv.decode(fs.readFileSync(filePath), encoding);

    const [headerLine] = data.split('\n');
    const delimiter = detectDelimiter(headerLine);

    return parse(data, {
        columns: true,
        skip_empty_lines: true,
        delimiter
    });
}

module.exports = { processInput };
