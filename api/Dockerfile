FROM mhart/alpine-node:10.4.0

RUN npm install -g postgraphile@4.0.0-rc.1
ARG API_WORKDIR
WORKDIR $API_WORKDIR

# Cache installation before
COPY start.sh .

CMD [ "sh", "start.sh" ]
