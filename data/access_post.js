

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
    //
    const postNew = {
        'userId': userNameCanonical(userNameAuthor),
        text: postContent.text,
    };
    // Doesn't work with sqlite3
    // const result = await database('posts')
    //     .returning(['postId', 'userId', 'text', 'created'])
    //     .insert(postNew);
    const postId = await database('posts').insert(postNew);
    const result = await postGet(postId[0]);
    //
    return result;
}
export async function feedGet(userId) {
    const userIdAuthor = userNameCanonical(userId);
    // const posts = await database('posts')
    //     .select('postId', 'userId', 'text', 'created')
    //     .where({'userId': userIdAuthor});
    const posts = await database('posts')
        .crossJoin('follows', 'follows.targetId', '=', 'posts.userId')
        .select('postId', 'userId', 'text', 'created')
        .where({'follows.followerId': userIdAuthor});
    return {
        posts: posts,
    };
}
