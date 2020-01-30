

//== GraphQL data API ==========================================================

//-- Dependencies --------------------------------
import { readFileSync } from 'fs';
import graphqlHTTP from 'express-graphql';
import graphql from 'graphql';
import root from './resolvers.js';

//-- Build schema from text ----------------------
const schemaText = readFileSync('./api/schema.graphql', 'utf8');
const schema = graphql.buildSchema(schemaText);

//-- Export API middleware -----------------------
export default graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
});
