import { GraphQLObjectType } from 'graphql';

import * as t from '../util/types';
import paginate from '../util/slice';
import { Book } from '../../entity/book';
import { Genre } from '../../entity/genre';
import { Author } from '../../entity/author';
import BookType from './book';
import GenreType from './genre';
import AuthorType from './author';

export default new GraphQLObjectType({
  name: 'Query',

  fields: () => ({

    /**
     * Get a single book by id
     */
    book: {
      type: BookType,
      args: {
        id: { type: t.requiredInt },
      },
      async resolve(_, { id }) {
        return await Book.query().findById(id);
      },
    },

    /**
     * Get multiple books
     */
    books: paginate({
      srcName: 'Query',
      destType: BookType,
      async resolve(_, { limit, offset }) {
        const books = await Book.query()
          .limit(limit)
          .offset(offset);

        return books.map(book => book.toJSON());
      },
    }),

    /**
     * Get a single author by id
     */
    author: {
      type: AuthorType,
      args: {
        id: { type: t.requiredInt },
      },
      async resolve(_, { id }) {
        return await Author.query().findById(id);
      },
    },

    /**
     * Get multiple authors
     */
    authors: paginate({
      srcName: 'Query',
      destType: AuthorType,
      async resolve(_, { limit, offset }) {
        const authors = await Author.query()
          .limit(limit)
          .offset(offset);

        return authors.map(book => book.toJSON());
      },
    }),

    /**
     * Get a single genre by id
     */
    genre: {
      type: GenreType,
      args: {
        id: { type: t.requiredInt },
      },
      async resolve(_, { id }) {
        return await Genre.query().findById(id);
      },
    },

    /**
     * Get multiple genres
     */
    genres: paginate({
      srcName: 'Query',
      destType: GenreType,
      async resolve(_, { limit, offset }) {
        const genres = await Genre.query()
          .limit(limit)
          .offset(offset);

        return genres.map(book => book.toJSON());
      },
    }),
  }),
});
