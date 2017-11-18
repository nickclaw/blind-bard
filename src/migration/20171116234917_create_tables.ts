import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('books', t => {
    t.increments();

    t.integer('identifier').notNullable();
    t.text('title');
    t.text('description');
    t.string('language');
    t.integer('duration');
  });

  await knex.schema.createTable('authors', t => {
    t.increments();

    t.integer('identifier').notNullable();
    t.string('first_name');
    t.string('last_name');
  });

  await knex.schema.createTable('genres', t => {
    t.increments();

    t.integer('identifier').notNullable();
    t.string('name');
  });
};

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('books');
  await knex.schema.dropTableIfExists('authors');
  await knex.schema.dropTableIfExists('genres');
};
