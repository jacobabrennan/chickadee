

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
        .select('postId', 'authorId', 'text', 'created')
        .where({'postId': postId})
        .first();
}
export async function postCreate(userNameAuthor, postContent) {
    //
    const postNew = {
        'authorId': userNameCanonical(userNameAuthor),
        text: postContent.text,
    };
    // Doesn't work with sqlite3
    // const result = await database('posts')
    //     .returning(['postId', 'authorId', 'text', 'created'])
    //     .insert(postNew);
    const postId = await database('posts').insert(postNew);
    const result = await postGet(postId[0]);
    //
    return result;
}
export async function feedGet(userId) {
    const userIdAuthor = userNameCanonical(userId);
    // const posts = await database('posts')
    //     .select('postId', 'authorId', 'text', 'created')
    //     .where({'authorId': userIdAuthor});
    const posts = await database('posts')
        .crossJoin('follows', 'follows.targetId', '=', 'posts.authorId')
        .select('postId', 'authorId', 'text', 'created')
        .where({'follows.followerId': userIdAuthor});
    return {
        posts: posts,
    };
}
