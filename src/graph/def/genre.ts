import { GraphQLObjectType } from 'graphql';

import * as t from '../util/types';
import paginate from '../util/slice';
import { Genre } from '../../entity/genre';
import BookType from './book';

export default new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: { type: t.requiredInt },
    identifier: { type: t.requiredInt },
    name: { type: t.requiredString },

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
