

//==============================================================================

//-- Notes ---------------------------------------
/*
The auth api responds to most user errors with http status code 200 (ok). This
is because the communication between the user and the app is working correctly.
Non-application errors (in logic, database errors, etc.) are passed to upstream
handlers.
*/

//-- Dependencies --------------------------------
import express from 'express';
import * as dataAuth from '../data/access_auth.js';

//-- Project Constants ---------------------------
const URL_USERID = '/userid';
const URL_REGISTRATION = '/register';
const URL_LOGIN = '/login';
const URL_LOGOUT = '/logout';
const ERROR_AUTH_COLLISION = 'Invalid Login: already logged in';
const ERROR_AUTH_INVALID = 'Invalid Login: The user name or password were incorrect';
const ERROR_AUTH_NOLOGIN = 'Cannot Log Out: You are not currently logged in'

//------------------------------------------------
const router = express.Router();
export default router;

//== Route Handlers ============================================================

//-- User Id (am I logged in?) -------------------
router.get(URL_USERID, async function (request, response, next) {
    // Retrieve userId from session
    const userId = request.session.userId;
    // Attach userId if logged in
    const responseData = {};
    if(userId) {
        responseData.userId = userId;
    }
    // Send response
    response.json(responseData);
});

//-- Registration --------------------------------
router.post(URL_REGISTRATION, async function (request, response, next) {
    // Retrieve user submitted credentials
    let userNameRequested = request.body.userName;
    let passwordRaw = request.body.password;
    let emailRaw = request.body.email;
    // Attempt to register a new user, using credentials
    let userId;
    try {
        userId = await dataAuth.authRegister(
            userNameRequested,
            passwordRaw,
            emailRaw,
        );
    }
    // Handle errors
    catch(error) {
        next(error);
        return;
    }
    // Generate session
    request.session.userId = userId;
    // Respond with userId
    const responseData = {
        userId: userId,
    };
    response.json(responseData);
});

//-- Login ---------------------------------------
router.post(URL_LOGIN, async function (request, response, next) {
    let userId;
    // Retrieve user submitted credentials
    let userNameRaw = request.body.userName;
    let passwordRaw = request.body.password;
    // Cancel if already logged in
    try {
        if(request.session.userId) {
            throw ERROR_AUTH_COLLISION;
        }
    // Attempt to login
        userId = await dataAuth.credentialValidate(userNameRaw, passwordRaw);
        if(!userId) {
            throw ERROR_AUTH_INVALID;
        }
    }
    // Handle errors
    catch(error) {
        next(error);
        return;
    }
    // Generate session
    request.session.userId = userId;
    // Respond with userId
    const responseData = {
        userId: userId,
    };
    response.json(responseData);
});

//-- Logout --------------------------------------
router.post(URL_LOGOUT, async function (request, response, next) {
    // Cancel if not currently logged in
    if(!request.session.userId) {
        next(ERROR_AUTH_NOLOGIN);
        return;
    }
    // Destroy session
    delete request.session.userId;
    // Respond to http request
    response.status(200);
    response.end();
});


//== Error Handling ============================================================

//-- Error Handling ------------------------------
router.use(function (error, request, response, next) {
    // Pass non-user errors upstream (logic, database, etc.)
    switch(error) { 
        case ERROR_AUTH_COLLISION:
        case ERROR_AUTH_INVALID:
        case ERROR_AUTH_NOLOGIN:
        case dataAuth.ERROR_USERNAME_COLLISION:
        case dataAuth.ERROR_USERNAME_BAD:
        case dataAuth.ERROR_PASSWORD_BAD:
            break;
        default: {
            next(error);
            return;
        }
    }
    // Respond with information about the user's authentication error.
    let responseData = {
        error: error,
    };
    response.json(responseData);
});
