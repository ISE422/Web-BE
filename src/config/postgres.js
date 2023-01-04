// const pg = require("pg");
const pgp = require("pg-promise")({})
const config = {
      host: "dpg-cdv5t4pa6gdsa65rbna0-a.oregon-postgres.render.com",
      port: "5432",
      user: "quanlihocsinh_user",
      password: "u6JekJ9HSPs51FiFYQ6zmuurqdx0M6bV",
      database: "quanlihocsinh",
      ssl: true,
    }

const db = pgp(config)

module.exports ={
  db,pgp
}
