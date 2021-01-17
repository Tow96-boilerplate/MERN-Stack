/** App.js
 * Copyright (c) 2020, Jose Tow
 * All rights reserved.
 * 
 * Main file for the Backend, establishes the connections and middleware
 */

// TODO: Delete unconfirmed accounts after 7 days

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const schedule = require('node-schedule');

const routes = require('./routes/index');
const database = require('./database/mongoose');

// utils
const logger = require('./utils/logger');
const { cleanDatabase } = require('./utils/cleanDatabase');

const app = express();

// Cleans the database every 2AM
schedule.scheduleJob('0 2 * * *', () => { cleanDatabase(); });

//#region Settings
app.set('port', process.env.PORT || 3000);
//#endregion

//#region middleware

//use json bodyparser
app.use(express.json());

//morgan: allows the console to provide http protocol logs (only outside of production)
if (process.env.NODE_ENV !== 'production') { app.use(morgan('dev')); }

//CORS: enabled on the env file
if (process.env.ENABLE_CORS == 'true') {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-refresh-token, x-auth-token");

    // Provide pre-flight authorization
    if ('OPTIONS' == req.method) { res.sendStatus(204); }
    else { next(); }
  });
  logger.info('CORS enabled');
}
//#endregion

// Setup routes
app.use('/', routes);

// Start server
app.listen(app.get('port'), () => {
  logger.info(`Server running on port: ${app.get('port')}`);
});