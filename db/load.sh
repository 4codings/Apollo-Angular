export SCRIPT=$1

export PGPASSWORD=$POSTGRES_PASSWORD

psql -h $POSTGRES_HOST \
    -d $POSTGRES_DB \
    -U $POSTGRES_USER \
    -p $POSTGRES_PORT \
    -a -w -f $SCRIPT
