

//==============================================================================

//-- Dependencies --------------------------------
import database from '../database/index.js';
import {
    ERROR_USERNAME_BAD,
    userNameCanonical,
} from './utilities.js';

//------------------------------------------------
export async function postGet(postId) {
    return await database('posts')
        .select('postId', 'userId', 'text', 'created')
        .where({'postId': postId})
        .first();
}
export async function postCreate(userNameAuthor, postContent) {
    let userIdAuthor = userNameCanonical(userNameAuthor);
    const postNew = {
        'userId': userIdAuthor,
        text: postContent.text,
    };
    return await database('posts').insert(postNew);
}
export async function feedGet(userId) {
    let userIdAuthor = userNameCanonical(userId);
    return await database('posts')
        .select('postId', 'userId', 'text', 'created')
        .where({'userId': userIdAuthor});
}
