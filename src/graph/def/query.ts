import { declareSlice, applySlice, resolveSlice, } from '../util/slice';
import { Book } from '../../entity/book';

export const def = `
  ${declareSlice('Query', 'Book')}

  type Query {
    ${applySlice('books', 'Query', 'Book')}
  }
`;

export const resolver = {
  Query: {
    books: resolveSlice(async (_, args) => {
      const books = await Book.query()
        .limit(args.limit)
        .offset(args.offset);

      return books.map(book => book.toJSON());
    }),
  }
};
