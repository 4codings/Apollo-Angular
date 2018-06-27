.PHONY: network db seed api angular-dev angular-prod

SHELL=bash

NETWORK_NAME=api-sql-angular

DB_TAG=pg-db-tag
DB_WORKDIR=/var/workdir/db
DB_NAME=pg-postgres-name

# Postgres port cannot be modified in onjin/alpine-postgres
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=postgres
POSTGRES_HOST=postgres-host
POSTGRES_PORT=5432

API_TAG=pg-api-tag
API_NAME=pg-api-name
API_WORKDIR=/var/workdir/api
API_HOST=localhost
API_PORT=5001

APOLLO_SCHEMA=angular/src/app/gen/schema.json
APOLLO_TYPES=angular/src/app/gen/apollo-types.ts

ANGULAR_NAME=angular
ANGULAR_WORKDIR=/var/angular
ANGULAR_TAG_DEV=angular:dev
ANGULAR_TAG_PROD=angular:prod
ANGULAR_PORT=9001
ANGULAR_HOST=angular-host

# Docker commands
network:
	-docker network rm $(NETWORK_NAME)
	docker network create --driver bridge $(NETWORK_NAME)

db:
	-docker rm -f $(DB_NAME)

	docker build -t $(DB_TAG) \
		--build-arg DB_WORKDIR=$(DB_WORKDIR) \
		./db/.

	docker run -p $(POSTGRES_PORT):$(POSTGRES_PORT) -it \
		--volume $(shell pwd)/db:$(DB_WORKDIR):ro \
		--network=$(NETWORK_NAME) \
		--network-alias=$(POSTGRES_HOST) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		--name $(DB_NAME) \
		$(DB_TAG)

seed:
	-docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh schema-drop.sql

	docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh schema.sql

	docker exec -it $(DB_NAME) \
		/bin/bash $(DB_WORKDIR)/load.sh data.sql

api:
	-docker rm -f $(API_NAME)

	docker build -t $(API_TAG) \
		--build-arg API_WORKDIR=$(API_WORKDIR) \
		./api/.

	docker run -p $(API_PORT):$(API_PORT) -it \
		--volume $(shell pwd)/api:$(API_WORKDIR):ro \
		--network=$(NETWORK_NAME) \
		--name $(API_NAME) \
		-e API_PORT=$(API_PORT) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_HOST=$(POSTGRES_HOST) \
		-e POSTGRES_PORT=$(POSTGRES_PORT) \
		-e POSTGRES_DB=$(POSTGRES_DB) \
		$(API_TAG)

codegen:
	npx apollo-codegen introspect-schema \
		http://$(API_HOST):$(API_PORT)/graphql \
		--output $(APOLLO_SCHEMA)
	npx apollo-codegen generate angular/**/*.graphql \
		--schema $(APOLLO_SCHEMA) \
		--target typescript \
		--output $(APOLLO_TYPES)


angular-prod:
	-docker rm -f $(ANGULAR_NAME)

	docker build -t $(ANGULAR_TAG_PROD) \
		-f ./angular/Dockerfile.Prod \
		--build-arg ANGULAR_WORKDIR=$(ANGULAR_WORKDIR) \
		./angular/.

angular-dev:
	-docker rm -f $(ANGULAR_NAME)

	docker build -t $(ANGULAR_TAG_DEV) \
		-f ./angular/Dockerfile.Dev \
		--build-arg ANGULAR_WORKDIR=$(ANGULAR_WORKDIR) \
		./angular/.

	# Note that the local volume mount path must be absolute
	docker run -p $(ANGULAR_PORT):$(ANGULAR_PORT) -it \
		--volume $(shell pwd)/angular/src:$(ANGULAR_WORKDIR)/src:ro \
		--network=$(NETWORK_NAME) \
		--name $(ANGULAR_NAME) \
		-e ANGULAR_WORKDIR=$(ANGULAR_WORKDIR) \
		-e API_HOST=$(API_HOST) \
		-e API_PORT=$(API_PORT) \
		-e ANGULAR_PORT=$(ANGULAR_PORT) \
		$(ANGULAR_TAG_DEV)
