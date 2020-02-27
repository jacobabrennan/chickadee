

//== Apollo GraphQL Server =====================================================

//-- Dependencies --------------------------------
import { readFileSync } from 'fs';
import apollo from 'apollo-server-express';
import resolvers from './resolvers.js';

//-- Configure Server ----------------------------
const schemaText = readFileSync('./api/schema.graphql', 'utf8');
const apolloOptions = {
    typeDefs: apollo.gql(schemaText),
    resolvers: resolvers,
    context: function (expressSignature) {
        return {
            request: expressSignature.req,
            response: expressSignature.res,
        };
    }
};
const server = new apollo.ApolloServer(apolloOptions);
export default server;
