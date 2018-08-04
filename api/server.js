const express = require("express");
const { postgraphile } = require("postgraphile");

const API_PORT          = process.env.API_PORT
      API_HOST          = process.env.API_HOST
      POSTGRES_USER     = process.env.POSTGRES_USER
      POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
      POSTGRES_HOST     = process.env.POSTGRES_HOST
      POSTGRES_PORT     = process.env.POSTGRES_PORT
      POSTGRES_DB       = process.env.POSTGRES_DB

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

const options = {
  watchPg: true,
  enableCors: true,
  dynamicJson: true,
  showErrorStack: true,
  extendedErrors: ['hint', 'detail', 'errcode'],
  pgDefaultRole: 'forum_example_anonymous',
  jwtSecret: "6YHDPAICN1BCRTEGWQUYPFK6TCBKY0",
  jwtPgTypeIdentifier: "forum_example.jwt_token",
  graphiql: true,
}

const app = express();

app.use(
  postgraphile(
    DATABASE_URL,
    "forum_example",
    options
  )
);

console.log(`Connecting to postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`)

app.listen(
  API_PORT,
  API_HOST || '0.0.0.0',
  callback=() => console.log(`Listening on port ${API_PORT}`)
);
