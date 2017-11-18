import 'reflect-metadata';
import knex from './dep/knex';
import redis from './dep/redis';
import app from './app';
import { createServer } from 'http';

async function init() {
  await knex;
  await redis;

  const port = process.env.PORT;
  createServer(app).listen(port);
}

init().catch(e => {
  console.error(e);
  process.exit(1);
});
