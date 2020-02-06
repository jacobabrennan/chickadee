

//==============================================================================

//-- Dependencies --------------------------------
import database from '../database/index.js';
import {
    ERROR_USERNAME_BAD,
    userNameCanonical,
} from './utilities.js';

//------------------------------------------------
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
