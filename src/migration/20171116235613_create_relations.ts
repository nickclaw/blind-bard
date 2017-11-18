import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('books_authors', t => {
    t.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books');

    t.integer('author_id')
      .notNullable()
      .references('id')
      .inTable('authors');
  });

  await knex.schema.createTable('books_genres', t => {
    t.integer('book_id')
      .notNullable()
      .references('id')
      .inTable('books');

    t.integer('genre_id')
      .notNullable()
      .references('id')
      .inTable('genres');
  });
};

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('books_authors');
  await knex.schema.dropTableIfExists('books_genres');
};
