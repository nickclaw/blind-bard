export default {
  client: "postgresql",
  connection: {
    host: 'postgres.local',
    port: 5432,
    database: "vox",
    user: "user",
    password: "pass"
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tablename: 'migrations',
    directory: __dirname + '/src/migration',
  },
};
