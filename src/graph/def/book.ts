import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import paginate from '../util/slice';
import { Book } from '../../entity/book';
import { Author } from '../../entity/author';
import AuthorType from './author';
import GenreType from './genre';

export default new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    identifier: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },

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
