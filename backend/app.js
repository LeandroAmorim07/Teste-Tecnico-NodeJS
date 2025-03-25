const express = require('express'); // We import express
const loggerMiddleware = require('./middlewares/logger.middlewares'); // We import the logger middleware


const app = express();

app.use(express.json()); // We add this line to enable JSON body parsing
app.use(loggerMiddleware); // We add this line to enable the logger middleware
app.use('/api/clientes', require('./routes/clients.routes')); // We add this line to use the clients routes

module.exports = app;