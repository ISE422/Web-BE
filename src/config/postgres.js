// const pg = require("pg");

// module.exports.getClient = async () => {
//   const client = new pg.Client({
//     host: "dpg-cdv5t4pa6gdsa65rbna0-a.oregon-postgres.render.com",
//     port: "5432",
//     user: "quanlihocsinh_user",
//     password: "u6JekJ9HSPs51FiFYQ6zmuurqdx0M6bV",
//     database: "quanlihocsinh",
//     ssl: true,
//   });
//   await client.connect();
//   return client;
// };

const pgp = require("pg-promise")({});
const databaseConfig = {
  host: "dpg-cdv5t4pa6gdsa65rbna0-a.oregon-postgres.render.com",
  port: 5432,
  database: "quanlihocsinh",
  user: "quanlihocsinh_user",
  password: "u6JekJ9HSPs51FiFYQ6zmuurqdx0M6bV",
  max: 30, // use up to 30 connections
  ssl: true,
};
const db = pgp(databaseConfig);
module.exports = {
  pgp,
  db,
};
