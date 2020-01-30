

//==============================================================================

//-- Dependencies --------------------------------
import { readFileSync } from 'fs';
import graphqlHTTP from 'express-graphql';
import graphql from 'graphql';
import * as dataPost from '../data/access_post.js';
import * as dataFollow from '../data/access_follow.js';

//------------------------------------------------
// Construct a schema, using GraphQL schema language
const schemaText = readFileSync('./api/schema.graphql', 'utf8');
const schema = graphql.buildSchema(schemaText);

//------------------------------------------------
// The root provides a resolver function for each API endpoint
const root = {
    async postGet(query, request) {
        // Construct parameters
        const postId = query.postId;
        // Retrieve Data
        const result = await dataPost.postGet(postId);
        return result;
    },
    async postCreate(query, request) {
        // Construct parameters
        const userIdAuthor = request.session.userId;
        const postContent = {
            text: query.text,
        };
        // Retrieve Data
        const result = await dataPost.postCreate(userIdAuthor, postContent);
        return result;
    },
    async feedGet(query, request) {
        // Construct parameters
        const userId = query.userId;
        // Retrieve Data
        const result = await dataPost.feedGet(userId);
        return result;
    },
    async followersGet(query, request) {
        // Construct parameters
        const userId = query.userId;
        // Retrieve Data
        const result = await dataFollow.followersGet(userId);
        return result;
    },
    async followLinkAdd(query, request) {
        // Construct parameters
        const followerId = request.session.userId;
        const targetId = query.targetId;
        // Retrieve Data
        const result = await dataFollow.followLinkAdd(followerId, targetId);
        return result;
    },
    async followLinkRemove(query, request) {
        // Construct parameters
        const followerId = request.session.userId;
        const targetId = query.targetId;
        // Retrieve Data
        const result = await dataFollow.followLinkRemove(followerId, targetId);
        return result;
    },
};

//------------------------------------------------
export default graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
});
