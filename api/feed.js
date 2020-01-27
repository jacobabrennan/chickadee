

//==============================================================================

//-- Dependencies --------------------------------
import express from 'express';
import { feedGet, postCreate } from '../data/access_post.js';

//-- Project Constants ---------------------------
const URL_POST_SUBMIT = '/post';
const ERROR_NOT_AUTHORIZED = 'Not Authorized: you are not logged in';

//------------------------------------------------
const router = express.Router();
export default router;

//-- Authorization -------------------------------
router.use(async function (request, response, next) {
    const userIdAuthenticated = request.session.userId;
    if(!userIdAuthenticated) {
        next(ERROR_NOT_AUTHORIZED);
        return;
    }
    next();
});


//== Route Handlers ============================================================

//------------------------------------------------
router.get('/', async function (request, response, next) {
    const postsFeed = await feedGet(request.session.userId);
    const dataResponse = {
        posts: postsFeed,
    };
    response.json(dataResponse);
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

//-- Posts ---------------------------------------
router.post(URL_POST_SUBMIT, async function (request, response, next) {
    const userId = request.session.userId;
    const contentRaw = request.body;
    const postId = await postCreate(userId, contentRaw);
    response.json({postId: postId});
})
