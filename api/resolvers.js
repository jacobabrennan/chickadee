

/*== GraphQL endpoint resolvers ================================================

This module provides resolvers for GraphQL queries. It is an exploratory work-
in-progress. This code is not secure or optimized, and does not follow best
practices. It is intended to be a sandbox to test ideas and implementation
strategies until such a time as the UI is finalized.

NOTE: None of this is optimized. The database is hit several times per query.
Research how to batch queries.

NOTE: Thrown errors in resolvers are currently sent to client. Don't do this

*/

//-- Dependencies --------------------------------
import fs from 'fs';
import * as dataPost from '../data/access_post.js';
import * as dataFollow from '../data/access_follow.js';
import database from '../database/index.js';

//------------------------------------------------
export default {
    Query: {
        authGet,
        userGet,
        userActivityGet,
        postGet,
        feedGet,
        followersGet,
        followsGet,
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
async function authGet(parent, args, context, info) {
    //
    if(!context.request.session || !context.request.session.userId) {
        return null;
    }
    const userId = context.request.session.userId;
//
const row = await database('users')
    .where({'userId': userId})
    .first()
    .select('userId', 'name', 'description', 'portraitUrl')
    .select(function () {
        this.from('follows')
            .where({'follows.targetId': userId})
            .count().as('countFollowers');
    })
    .select(function () {
        this.from('follows')
            .where({'follows.followerId': userId})
            .count().as('countFollowing');
    });
    //
    const userData = {
            userId: row.userId,
            name: row.name,
            description: row.description,
            portraitUrl: row.portraitUrl,
            followers: {
                countFollowers: row.countFollowers,
                countFollowing: row.countFollowing,
            }
        }
    //
    return userData;
}
async function userGet(parent, args, context, info) {
    // Construct parameters
    const userId = context.request.session.userId;
    const targetId = args.userId;
    // Retrieve Data
    const row = await database('users')
        .where({'userId': targetId})
        .first()
        .select('userId', 'name', 'description', 'portraitUrl')
        .select(function () {
            this.from('follows')
                .where({'follows.targetId': userId})
                .whereRaw('follows.followerId = users.userId', [])
                .first().count().as('follows');
        })
        .select(function () {
            this.from('follows')
                .where({'follows.followerId': userId})
                .whereRaw('follows.targetId = users.userId', [])
                .first().count().as('following');
        })
        .select(function () {
            this.from('follows')
                .where({'follows.targetId': targetId})
                .count().as('countFollowers');
        })
        .select(function () {
            this.from('follows')
                .where({'follows.followerId': targetId})
                .count().as('countFollowing');
        });
    //
    const followData = {
        userId: row.userId,
        name: row.name,
        description: row.description,
        portraitUrl: row.portraitUrl,
        followers: {
            countFollowers: row.countFollowers,
            countFollowing: row.countFollowing,
            follows: row.follows,
            following: row.following,
        }
    }
    //
    return followData;
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
        const portraitUrl = `/rsc/portrait/${userId}.png`;
        const portraitPath = `public/portrait/${userId}.png`;
        await fs.promises.writeFile(portraitPath, portraitData, 'base64')
        updateData.portraitUrl = portraitUrl;
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
    const row = await database('posts')
        .where({'postId': postId})
        .first()
        .join('users', 'posts.authorId', '=', 'users.userId')
        .select(
            'posts.postId', 'posts.authorId', 'posts.text', 'posts.created',
            'users.name', 'users.userId', 'users.portraitUrl',
        );
    //
    return {
        posts: [{
            postId: row.postId,
            authorId: row.authorId,
            text: row.text,
            created: row.created,
        }],
        userContexts: [{
            userId: row.userId,
            name: row.name,
            portraitUrl: row.portraitUrl
        }]
    };
}
async function postCreate(parent, args, context, info) {
    // NOTE: Look into "batching" multiple SQL queries together
    // NOTE: this throws on database failures
    // Construct parameters
    const userIdAuthor = context.request.session.userId;
    const postId = (await database('posts')
        .insert({
            'authorId': userIdAuthor,
            text: args.text,
        }))[0];
    const post = await database('posts')
        .select('postId', 'authorId', 'text', 'created')
        .where({postId: postId})
        .first();
    // Retrieve Data
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
    const rows2 = await database('users')
        .where({'userId': userId})
        .crossJoin('posts', 'posts.authorId', '=', 'users.userId')
        .select(
            'posts.postId', 'posts.authorId', 'posts.text', 'posts.created',
            'users.name', 'users.userId', 'users.portraitUrl',
        );
    // Construct return data from retrieved rows
    const postUserIds = new Set()
    const feedData = {posts: [], userContexts: []}
    let rowsFull = rows.concat(rows2);
    rowsFull.forEach(function (row) {
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
    const userId = context.request.session.userId;
    const targetId = args.userId;
    // Retrieve Data: "From all users that follow target, get their user info"
    const rows = await database('follows')
        .where({'follows.targetId': targetId})
        .join('users', 'follows.followerId', '=', 'users.userId')
        .select(
            'users.userId', 'users.name', 'users.description', 'users.portraitUrl',
        )
        .select(function () {
            this.from('follows')
                .where({'follows.targetId': userId})
                .whereRaw('follows.followerId = users.userId', [])
                .first().count().as('follows');
        })
        .select(function () {
            this.from('follows')
                .where({'follows.followerId': userId})
                .whereRaw('follows.targetId = users.userId', [])
                .first().count().as('following');
        });
    // Construct GraphQL graph from SQL rows
    const followers = rows.map(function (databaseRow) {
        return {
            userId: databaseRow.userId,
            name: databaseRow.name,
            description: databaseRow.description,
            portraitUrl: databaseRow.portraitUrl,
            followers: {
                follows: databaseRow.follows,
                following: databaseRow.following,
            },
        };
    });
    // Return followers data
    return followers;
}
async function followsGet(parent, args, context, info) {
    // NOTE: Look into 'clone' for portion of query shared with other resolvers
    // Construct parameters
    const userId = context.request.session.userId;
    const targetId = args.userId;
    // Retrieve Data: "From all users that user follows, get their user info"
    const rows = await database('follows')
        .where({'follows.followerId': targetId})
        .join('users', 'follows.targetId', '=', 'users.userId')
        .select(
            'users.userId', 'users.name', 'users.description', 'users.portraitUrl',
        )
        .select(function () {
            this.from('follows')
                .where({'follows.targetId': userId})
                .whereRaw('follows.followerId = users.userId', [])
                .first().count().as('follows');
        })
        .select(function () {
            this.from('follows')
                .where({'follows.followerId': userId})
                .whereRaw('follows.targetId = users.userId', [])
                .first().count().as('following');
        });
    // Construct GraphQL graph from SQL rows
    const follows = rows.map(function (databaseRow) {
        return {
            userId: databaseRow.userId,
            name: databaseRow.name,
            description: databaseRow.description,
            portraitUrl: databaseRow.portraitUrl,
            followers: {
                follows: databaseRow.follows,
                following: databaseRow.following,
            },
        };
    });
    // Return followers data
    return follows;
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
