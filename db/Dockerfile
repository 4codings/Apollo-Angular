FROM onjin/alpine-postgres:9.6.2

RUN apk update && apk upgrade && apk add bash

ARG DB_WORKDIR
WORKDIR $DB_WORKDIR

# Use command from parent
