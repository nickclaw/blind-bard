import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import paginate from '../util/slice';
import { Author } from '../../entity/author';
import BookType from './book';

export default new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    identifier: { type: new GraphQLNonNull(GraphQLInt) },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },

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
