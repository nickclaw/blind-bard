import { GraphQLSchema } from 'graphql';
import query from './def/query';

export default new GraphQLSchema({
  query: query,
});
