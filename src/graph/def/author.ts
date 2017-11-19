import { GraphQLObjectType } from 'graphql';

import paginate from '../util/slice';
import * as t from '../util/types';
import { Author } from '../../entity/author';
import BookType from './book';

export default new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: t.requiredInt },
    identifier: { type: t.requiredInt },
    first_name: { type: t.string },
    last_name: { type: t.string },

    books: paginate({
      srcName: 'Author',
      destType: BookType,
      async resolve(author, { limit, offset }) {
        const entity = Author.fromJson(author);
        const books = await entity
          .$relatedQuery('books')
          .limit(limit)
          .offset(offset);

        return books.map(obj => obj.toJSON());
      },
    }),
  }),
});
