

//== GraphQL endpoint resolvers ================================================

/*
    NOTE: None of this is optimized. The database is hit several times per
    query. Research how to batch queries.

    Note: Ok, I've basically given up on writing good SQL queries. Someone else
    can fix this up later. Time to put my brain on vacation and write some
    queries.
*/

//-- Dependencies --------------------------------
import fs from 'fs';
import * as dataPost from '../data/access_post.js';
import * as dataFollow from '../data/access_follow.js';
import * as dataUser from '../data/access_user.js';
import database from '../database/index.js';

//------------------------------------------------
export default {
    Query: {
        userGet,
        userActivityGet,
        postGet,
        feedGet,
        followersGet,
    },
    Mutation: {
        userUpdate,
        postCreate,
        followLinkAdd,
        followLinkRemove,
    },
}


/*
-home:
    -get feed: [PostContext!]!
    make post (mutate): PostContext
-user profile view:
    get user info: ????
    -get user feed: [PostContext!]!
    follow (mutate): Boolean!
    unfollow (mutate): Boolean!
edit profile view:
    get profile: User!
    set profile (mutate): User!
-view post:
    -get post: [postContext!]!
*/

//-- Users ---------------------------------------
async function userGet(parent, args, context, info) {
    // NOTE: This is such a mess...
    // Construct parameters
    const userId = context.request.session.userId;
    const targetId = args.userId;
    const getData = ['userId','name','description','portraitUrl'];
    // Retrieve Data
    const result = await dataUser.userGet(targetId, getData);
    // Get follower Data 
    result.followers = {
        count: (await database('follows').count().where({
            'targetId': targetId,
        }))[0]['count(*)'],
        following: (await database('follows').count().where({
            'followerId': userId,
            'targetId': targetId,
        }))[0]['count(*)'],
        follows: (await database('follows').count().where({
            'followerId': targetId,
            'targetId': userId,
        }))[0]['count(*)'],
    };
    return result;
}
async function userUpdate(parent, args, context, info) {
    // NOTE: This needs actual security checks for submitted image data
    /* NOTE: If userId check moved to dedicated auth layer, ensure file system
        and database do not become desyncronized. */
    // NOTE: Standardize rsc / file upload url
    //
    const userId = context.request.session.userId;
    if(!userId) { throw "Invalid User";}
    //
    const name = args.name;
    const description = args.description;
    const updateData = {};
    if(name){ updateData.name = name;}
    if(description){ updateData.description = description;}
    //
    if(args.portrait) {
        const portraitDataURL = args.portrait;
        const base64Prefix = 'data:image/png;base64,';
        if(portraitDataURL.indexOf(base64Prefix)) { throw "Invalid Portrait Data";}
        const portraitData = portraitDataURL.substring(22);
        const portraitURL = `/rsc/portrait/${userId}.png`;
        const portraitPath = `public/portrait/${userId}.png`;
        await fs.promises.writeFile(portraitPath, portraitData, 'base64')
        updateData.portraitUrl = portraitURL;
    }
    // Retrieve Data
    await database('users')
        .where({userId: userId})
        .update(updateData);
    updateData.userId = userId;
    return updateData;
}

//-- Posts ---------------------------------------
async function postGet(parent, args, context, info) {
    // Construct parameters
    const postId = args.postId;
    // Retrieve Data
    const result = await dataPost.postGet(postId);
    return result;
}
async function postCreate(parent, args, context, info) {
    // NOTE: Look into "batching" multiple SQL queries together
    // Construct parameters
    const userIdAuthor = context.request.session.userId;
    const postContent = {
        text: args.text,
    };
    // Retrieve Data
    const post = await dataPost.postCreate(userIdAuthor, postContent);
    const author = await database('users')
        .select('userId', 'name', 'portraitUrl')
        .where({'userId': userIdAuthor})
        .first();
    return {
        posts: [post],
        userContexts: [author]
    };
}

//-- Feed ----------------------------------------
async function feedGet(parent, args, context, info) {
    // Construct parameters
    const userId = context.request.session.userId;
    // Retrieve Data: "From all users that I follow, get their posts and info"
    const rows = await database('follows')
        .where({'follows.followerId': userId})
        .join('users', 'follows.targetId', '=', 'users.userId')
        .crossJoin('posts', 'posts.authorId', '=', 'users.userId')
        .select(
            'posts.postId', 'posts.authorId', 'posts.text', 'posts.created',
            'users.name', 'users.userId', 'users.portraitUrl',
        );
    // Construct return data from retrieved rows
    const postUserIds = new Set()
    const feedData = {posts: [], userContexts: []}
    rows.forEach(function (row) {
        // Reconstruct posts from rows
        feedData.posts.push({
            postId: row.postId,
            authorId: row.authorId,
            text: row.text,
            created: row.created,
        });
        // Filter out duplicate user contexts
        if(postUserIds.has(row.userId)) { return;}
        postUserIds.add(row.userId);
        feedData.userContexts.push({
            userId: row.userId,
            name: row.name,
            portraitUrl: row.portraitUrl,
        });
    });
    // Return result
    return feedData;
}
async function userActivityGet(parent, args, context, info) {
    // NOTE: Look into "batching" multiple SQL queries together
    const userId = args.userId;
    const posts = await database('posts')
        .select('postId', 'authorId', 'text', 'created')
        .where({'authorId': userId});
    const userContext = await database('users')
        .select('userId', 'name', 'portraitUrl')
        .where({'userId': userId})
        .first();
    return {
        posts: posts,
        userContexts: [userContext],
    };
}

//-- Followers -----------------------------------
async function followersGet(parent, args, context, info) {
    // Construct parameters
    const userId = args.userId;
    // Retrieve Data
    const result = await dataFollow.followersGet(userId);
    return result;
}
async function followLinkAdd(parent, args, context, info) {
    // Construct parameters
    const followerId = context.request.session.userId;
    const targetId = args.targetId;
    // Retrieve Data
    const result = await dataFollow.followLinkAdd(followerId, targetId);
    return result;
}
async function followLinkRemove(parent, args, context, info) {
    // Construct parameters
    const followerId = context.request.session.userId;
    const targetId = args.targetId;
    // Retrieve Data
    const result = await dataFollow.followLinkRemove(followerId, targetId);
    return result;
}
