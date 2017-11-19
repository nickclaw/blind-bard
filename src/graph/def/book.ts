import { GraphQLObjectType } from 'graphql';

import * as t from '../util/types';
import paginate from '../util/slice';
import { Book } from '../../entity/book';
import { Author } from '../../entity/author';
import AuthorType from './author';
import GenreType from './genre';

export default new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: t.requiredInt },
    identifier: { type: t.requiredInt },
    title: { type: t.requiredString },
    description: { type: t.string },
    language: { type: t.requiredString },
    duration: { type: t.requiredInt },

    authors: paginate({
      srcName: 'Book',
      destType: AuthorType,
      async resolve(book, { offset, limit }) {
        const entity = Book.fromJson(book);
        const authors = await entity
          .$relatedQuery('authors')
          .limit(limit)
          .offset(offset);

        return authors.map(obj => obj.toJSON());
      },
    }),

    genres: paginate({
      srcName: 'Book',
      destType: GenreType,
      async resolve(book, { offset, limit }) {
        const entity = Book.fromJson(book);
        const genres = await entity
          .$relatedQuery('genres')
          .limit(limit)
          .offset(offset);

        return genres.map(obj => obj.toJSON());
      }
    }),
  }),
});
