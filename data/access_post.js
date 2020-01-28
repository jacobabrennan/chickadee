

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
    const userIdAuthor = userNameCanonical(userNameAuthor);
    const postNew = {
        'userId': userIdAuthor,
        text: postContent.text,
    };
    return await database('posts').insert(postNew);
}
export async function feedGet(userId) {
    const userIdAuthor = userNameCanonical(userId);
    const posts = await database('posts')
        .select('postId', 'userId', 'text', 'created')
        .where({'userId': userIdAuthor});
    return {
        posts: posts,
    };
}
