
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.txt');

const logger = (req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\n`;
    console.log(logMessage); 

    // Saves in a file
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Erro ao registrar log:", err);
        }
    });

    next();
};

module.exports = logger;
