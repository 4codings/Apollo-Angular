const express = require("express");
const { postgraphile } = require("postgraphile");

const API_PORT          = process.env.API_PORT
      POSTGRES_USER     = process.env.POSTGRES_USER
      POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
      POSTGRES_HOST     = process.env.POSTGRES_HOST
      POSTGRES_PORT     = process.env.POSTGRES_PORT
      POSTGRES_DB       = process.env.POSTGRES_DB

const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

console.log(`Logging in on ${DATABASE_URL}`)

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

app.listen(API_PORT, '0.0.0.0');
