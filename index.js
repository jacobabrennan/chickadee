

/*== Chickadee Server ==========================================================

This is the point of entry for the Chickadee server. To start the server, run
this file via node:
    node index.js

*/

//-- Dependencies --------------------------------
import express from 'express';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import sessionSecret from './secure/session_secret.js';
import apiAuth from './api/auth.js';
import errors from './errors.js';
import graphQLServer from './api/apollo.js';

//-- Project Constants ---------------------------
const PORT = 7231;
const SERVER_LISTEN_MESSAGE = `Server listening on port ${PORT}`;

//-- Start Server---------------------------------
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

//-- Mount Routers -------------------------------
server.use('/rsc', express.static('public'));
server.use('/auth', apiAuth);
graphQLServer.applyMiddleware({app: server, path: '/data'});

//-- Error Handling ------------------------------
server.use(errors.handler);
