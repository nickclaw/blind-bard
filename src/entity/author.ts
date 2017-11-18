import { Model, RelationMappings } from 'objection';
import { Book } from './book';

export class Author extends Model {

  static tableName = 'authors';

  static relationMappings: RelationMappings = {
    books: {
      relation: Model.ManyToManyRelation,
      get modelClass() { return Book },
      join: {
        from: 'authors.id',
        to: 'books.id',
        through: {
          from: 'books_authors.author_id',
          to: 'books_authors.book_id',
        },
      }
    }
  };

  readonly id: number;
  identifier: number;
  first_name: string;
  last_name: string;
  books: Book[];
}
