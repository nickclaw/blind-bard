import { makeExecutableSchema } from 'graphql-tools';
import { Book } from '../entity/book';
import { Genre } from '../entity/genre';
import { Author } from '../entity/author';

const typeDefs = `

  type Book {
    id: Int!
    identifier: Int!
    title: String!
    description: String
    language: String!
    duration: Int!
    authors: [Author]
    genres: [Genre]
  }

  type Author {
    id: Int!
    identifier: Int!
    first_name: String!
    last_name: String!
    books: [Book]
  }

  type Genre {
    id: Int!
    identifier: Int!
    name: String!
    books: [Book]
  }

  type Query {
    books: [Book]!
  }
`;

const resolvers = {
  Query: {
    books: async (): Promise<Object> => {
      const books = await Book.query();
      return books.map(book => book.toJSON());
    },
  },

  Book: {
    authors: async (book: { id }): Promise<Object> => {
      const entity = await Book.query()
        .findById(book.id)
        .eager('authors')
        .execute();

      return entity.authors.map(author => author.toJSON());
    },

    genres: async (book: { id }): Promise<Object> => {
      const entity = await Book.query()
        .findById(book.id)
        .eager('genres')
        .execute();

      return entity.genres.map(genre => genre.toJSON());
    }
  },

  Author: {
    books: () => [],
  },

  Genre: {
    books: () => [],
  },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
