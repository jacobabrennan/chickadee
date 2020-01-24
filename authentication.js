

//==============================================================================

//-- Dependencies --------------------------------
import express from 'express';
import data from './data_access.js';
import errors from './errors.js';
import * as dataAuthentication from './data_access_authentication.js';

//-- Project Constants ---------------------------

//------------------------------------------------
const router = express.Router();
export default router;

//------------------------------------------------
router.post('/register', async function (request, response, next) {
    let userNameRequested = request.body.userName;
    let passwordRaw = request.body.password;
    let userId = await dataAuthentication.credentialCreate(userNameRequested, passwordRaw);
    if(!userId) {
        next(new errors.httpError(700));
        return;
    }
    request.session.userId = userId;
    response.status(200);
    response.end();
});
router.post('/login', async function (request, response, next) {
    //
    if(request.session.userId) {
        next(new errors.httpError(700));
        return;
    }
    //
    let userNameRaw = request.body.userName;
    let passwordRaw = request.body.password;
    let userId = await dataAuthentication.credentialValidate(userNameRaw, passwordRaw);
    if(!userId) {
        next(new errors.httpError(700));
        return;
    }
    //
    request.session.userId = userId;
    response.status(200);
    response.end();
});
router.post('/logout', async function (request, response, next) {
    //
    if(!request.session.userId) {
        next(new errors.httpError(700));
        return;
    }
    //
    delete request.session.userId;
    response.status(200);
    response.end();
});
