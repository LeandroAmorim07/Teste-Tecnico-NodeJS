const express = require('express'); // We import express
const loggerMiddleware = require('./middlewares/logger.middlewares'); // We import the logger middleware

const cors = require('cors');

const app = express();

app.use(express.json()); 
app.use(loggerMiddleware); 
app.use(cors()); // add this line to enable CORS for all routes
app.use('/clientes', require('./routes/clients.routes'));




module.exports = app;