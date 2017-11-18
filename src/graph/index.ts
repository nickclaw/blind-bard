import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { Book } from '../entity/book';
import { Genre } from '../entity/genre';
import { Author } from '../entity/author';

const GraphQLBook = new GraphQLObjectType({
  name: 'Book',
  description: 'An audio recording from librivox',
  fields: () => ({
    id: { type: GraphQLInt },
    identifier: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    language: { type: GraphQLString },
    duration: { type: GraphQLInt },
    authors: {
      type: new GraphQLList(GraphQLAuthor),
      resolve: async (book) => {
        const entity = await Book.query()
          .findById(book.id)
          .eager('authors');

        return entity.authors.map(author => author.toJSON());
      },
    }
  }),
});

const GraphQLAuthor = new GraphQLObjectType({
  name: 'Author',
  description: '',
  fields: () => ({
    id: { type: GraphQLInt },
    identifier: { type: GraphQLInt },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
  }),
});

const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  fields:  () => ({
    books: {
      type: new GraphQLList(GraphQLBook),
      resolve: async () => {
        const books = await Book.query();
        return books.map(book => book.toJSON());
      }
    }
  }),
})

export default new GraphQLSchema({
  query: GraphQLQuery,
  types: [GraphQLBook, GraphQLAuthor],
});
