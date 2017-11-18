import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import * as query from './def/query';
import * as genre from './def/genre';
import * as author from './def/author';
import * as book from './def/book';

type TypeDef = {
  def: string,
  resolver: Object,
};

function merge(...entries: TypeDef[]): GraphQLSchema {
  return makeExecutableSchema({
    typeDefs: entries.map(ent => ent.def),
    resolvers: Object.assign({}, ...entries.map(ent => ent.resolver)),
  });
}

export default merge(
  query,
  genre,
  author,
  book,
);
