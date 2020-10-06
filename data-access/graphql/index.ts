import { ApolloServer, gql }  from 'apollo-server-azure-functions';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer(
  { 
  typeDefs, 
  resolvers, 
  playground:true 
  },
);

exports.graphqlHandler = server.createHandler();