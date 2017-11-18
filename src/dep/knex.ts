import * as knex from 'knex';
import { Model } from 'objection';
import knexfile from '../../knexfile';

async function init() {
  const conn = knex(knexfile);

  await conn.raw('select 1 + 1');
  await conn.migrate.latest();
  Model.knex(conn);

  return conn;
}

export default init();
