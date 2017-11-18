import { declareSlice, applySlice, resolveSlice, } from '../util/slice';
import { Book } from '../../entity/book';
import { Author } from '../../entity/author';

export const def = `
  ${declareSlice('Book', 'Author')}
  ${declareSlice('Book', 'Genre')}

  type Book {
    id: Int!
    identifier: Int!
    title: String!
    description: String
    language: String!
    duration: Int!
    ${applySlice('authors', 'Book', 'Author')}
    ${applySlice('genres', 'Book', 'Genre')}
  }
`;

console.log(def);

export const resolver = {
  Book: {
    authors: resolveSlice(async (book: any, args: any) => {
      const entity = Book.fromJson(book);
      const authors = await entity
        .$relatedQuery('authors')
        .limit(args.limit)
        .offset(args.offset);

      return authors.map(obj => obj.toJSON());
    }),
    genres: resolveSlice(async () => {
      return [];
    }),
  },
};
