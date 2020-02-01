

//== GraphQL endpoint resolvers ================================================

/*
    NOTE: None of this is optimized. The database is hit several times per
    query. Research how to batch queries.

    Note: Ok, I've basically given up on writing good SQL queries. Someone else
    can fix this up later. Time to put my brain on vacation and write some
    queries.
*/

//-- Dependencies --------------------------------
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

//-- Users ---------------------------------------
async function userGet(parent, args, context, info) {
    // NOTE: This is such a mess...
    // Construct parameters
    const userId = context.request.session.userId;
    const targetId = args.userId;
    const getData = ['userId','name','description'];
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
    // Construct parameters
    const userId = context.request.session.userId;
    const name = args.name;
    const description = args.description;
    const updateData = {};
    if(name){ updateData.name = name;}
    if(description){ updateData.description = description;}
    // Retrieve Data
    await dataUser.userUpdate(userId, updateData);
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
    // Construct parameters
    const userIdAuthor = context.request.session.userId;
    const postContent = {
        text: args.text,
    };
    // Retrieve Data
    const result = await dataPost.postCreate(userIdAuthor, postContent);
    return {post: result};
}

//-- Feed ----------------------------------------
async function feedGet(parent, args, context, info) {
    // Construct parameters
    const userId = context.request.session.userId;
    // Retrieve Data
    const result = await dataPost.feedGet(userId);
    const postContexts = result.posts.map(function (post) {
        return {post: post};
    });
    return {postContexts: postContexts};
}
async function userActivityGet(parent, args, context, info) {
    const userId = args.userId;
    const posts = await database('posts')
        .select('postId', 'authorId', 'text', 'created')
        .where({'authorId': userId});
    const postContexts = posts.map(function (post) {
        return {post: post};
    });
    return {postContexts: postContexts};
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
