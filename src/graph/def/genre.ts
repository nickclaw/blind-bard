import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import paginate from '../util/slice';

import { Genre } from '../../entity/genre';
import BookType from './book';

export default new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    identifier: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },

    books: paginate({
      srcName: 'Genre',
      destType: BookType,
      async resolve(genre, { limit, offset }) {
        const entity = Genre.fromJson(genre);
        const books = await entity
          .$relatedQuery('books')
          .limit(limit)
          .offset(offset);

        return books.map(obj => obj.toJSON());
      },
    }),
  }),
});
