import { Model, RelationMappings } from 'objection';
import { Book } from './book';

export class Genre extends Model {

  static tableName = 'genres';

  static relationMappings: RelationMappings = {

    books: {
      relation: Model.ManyToManyRelation,
      get modelClass() { return Book },
      join: {
        from: 'genres.id',
        to: 'books.id',
        through: {
          from: 'books_genres.genre_id',
          to: 'books_genres.book_id',
        },
      }
    },
  };

  readonly id: number;
  identifier: number;
  name: string;
  books: Book[];
}
