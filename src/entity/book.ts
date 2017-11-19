import { Model, RelationMappings, raw } from 'objection';
import { Author } from './author';
import { Genre } from './genre';

export class Book extends Model {

  static tableName = 'books';

  static relationMappings: RelationMappings = {

    authors: {
      relation: Model.ManyToManyRelation,
      get modelClass() { return Author },
      join: {
        from: 'books.id',
        to: 'authors.id',
        through: {
          from: 'books_authors.book_id',
          to: 'books_authors.author_id',
        },
      },
    },

    genres: {
      relation: Model.ManyToManyRelation,
      get modelClass() { return Genre },
      join: {
        from: 'books.id',
        to: 'genres.id',
        through: {
          from: 'books_genres.book_id',
          to: 'books_genres.genre_id',
        },
      }
    },
  };

  static async search(opts: {
    query: string,
    limit: number,
    offset: number,
  }): Promise<Book[]> {
    return await Book.query()
      .limit(opts.limit)
      .offset(opts.offset)
      .where(raw(
        "to_tsvector('english', title) @@ to_tsquery('english', '??')",
        [opts.query]
      ));
  }

  readonly id: number;
  identifier: number;
  title: string;
  description: string;
  language: string;
  duration: number;
  authors: Author[];
  genres: Genre[];
}
