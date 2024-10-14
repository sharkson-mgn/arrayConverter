const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Funkcja do generowania unikalnej nazwy pliku
function generateUniqueFileName(dir, baseName, format) {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10).replace(/-/g, ''); // 'yyyymmdd'
    let iteration = 1;

    // Sprawdzanie istniejących plików i ustalanie iteracji
    while (fs.existsSync(path.join(dir, `${baseName}_${dateString}_${iteration}.${format}`))) {
        iteration += 1;
    }

    return `${baseName}_${dateString}_${iteration}.${format}`;
}

function loadModule(moduleType, format) {
    const modulePath = path.join(__dirname, 'modules', format, `${moduleType}.js`);
    if (fs.existsSync(modulePath)) {
        return require(modulePath);
    }
    return null;
}

function getAvailableInputFormats() {
    return fs.readdirSync(path.join(__dirname, 'modules')).filter(dir => {
        const inputPath = path.join(__dirname, 'modules', dir, 'input.js');
        return fs.existsSync(inputPath);
    });
}

function getAvailableOutputFormats(inputFormat) {
    return fs.readdirSync(path.join(__dirname, 'modules')).filter(dir => {
        const outputPath = path.join(__dirname, 'modules', dir, 'output.js');
        return fs.existsSync(outputPath) && dir !== inputFormat;
    });
}

async function showMenuAndConvert() {
    const inputFiles = fs.readdirSync(path.join(__dirname, 'input'));

    if (inputFiles.length === 0) {
        console.error('Brak plików w folderze "input".');
        return;
    }

    const { inputFileName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'inputFileName',
            message: 'Wybierz plik wejściowy:',
            choices: inputFiles
        }
    ]);

    const inputFormat = path.extname(inputFileName).substring(1);
    const { outputFormat } = await inquirer.prompt([
        {
            type: 'list',
            name: 'outputFormat',
            message: 'Wybierz format wyjściowy:',
            choices: getAvailableOutputFormats(inputFormat)
        }
    ]);

    const inputModule = loadModule('input', inputFormat);
    const outputModule = loadModule('output', outputFormat);

    if (inputModule && outputModule) {
        const inputFilePath = path.join(__dirname, 'input', inputFileName);
        const data = inputModule.processInput(inputFilePath);

        // Generowanie unikalnej nazwy pliku wyjściowego
        const baseName = path.basename(inputFileName, path.extname(inputFileName));
        const outputDir = path.join(__dirname, 'output');
        const uniqueFileName = generateUniqueFileName(outputDir, baseName, outputFormat);
        const outputFilePath = path.join(outputDir, uniqueFileName);

        outputModule.processOutput(outputFilePath, data);

        console.log(`Konwersja zakończona. Plik zapisany w: ${outputFilePath}`);
    } else {
        console.error('Nie znaleziono odpowiednich modułów do przetwarzania.');
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    showMenuAndConvert();
} else {
    // Obsługa przypadków z argumentami
}
