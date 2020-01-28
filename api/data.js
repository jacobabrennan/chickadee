

//==============================================================================

//-- Dependencies --------------------------------
import { readFileSync } from 'fs';
import graphqlHTTP from 'express-graphql';
import graphql from 'graphql';
import * as dataPost from '../data/access_post.js';

//------------------------------------------------
// Construct a schema, using GraphQL schema language
const schemaText = readFileSync('./api/schema.graphql', 'utf8');
const schema = graphql.buildSchema(schemaText);

//------------------------------------------------
// The root provides a resolver function for each API endpoint
const root = {
    async post(query, request) {
        const postId = query.postId;
        return await dataPost.postGet(postId);
    },
    async feed(query, request) {
        const userId = query.userId;
        return await dataPost.feedGet(userId);
    },
    async postCreate(query, request) {
        return await dataPost.postCreate();
    }
};

//------------------------------------------------
export default graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
});
