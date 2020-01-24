

//==============================================================================

//-- Dependencies --------------------------------
import express from 'express';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import sessionSecret from './secure/session_secret.js';
import apiData from './api_data.js';
import apiAuth from './api_auth.js';
import errors from './errors.js';

//-- Project Constants ---------------------------
const PORT = 7231;
const SERVER_LISTEN_MESSAGE = `Server listening on port ${PORT}`;

//------------------------------------------------
const server = express();
server.use(bodyParser.json());
server.use(expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
server.listen(PORT, function () {
    console.log(SERVER_LISTEN_MESSAGE);
});

//------------------------------------------------
server.use('/rsc', express.static('public'));
server.use('/data', apiData);
server.use('/auth', apiAuth);

//-- Error Handling ------------------------------
server.use(errors.handler);
  