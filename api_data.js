

//==============================================================================

//-- Dependencies --------------------------------
import express from 'express';
import data from './data_access.js';
import * as dataAuth from './data_auth.js';

//-- Project Constants ---------------------------

//------------------------------------------------
const router = express.Router();
export default router;

//------------------------------------------------
let userIdA = dataAuth.credentialCreate('Herp', '12345');
// let userIdB = data.userCreate("DERP")
// console.log(data.followLinkAdd(userIdA, userIdB));
// console.log(data.followingGet(userIdA));

//------------------------------------------------
router.get('/feed', async function (request, response, next) {
    if(!request.session.userId) {
        response.status(500);
        next();
        return;
    }
    response.send({userId: request.session.userId});
});
router.get('/user/:id', async function (request, response, next) {
    const userId = request.params.id;
    const userData = await data.userGet(userId);
    if(!userData) {
        next();
        return;
    }
    response.send(userData);
});
