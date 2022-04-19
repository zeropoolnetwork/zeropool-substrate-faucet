#!/usr/bin/env bash

printenv
original='env.js'
tmp=$(mktemp)

echo "Original ${original}"
cat $original && echo "\n"

cp --attributes-only --preserve $original $tmp
echo 'Replacing env variables...'
cat $original | envsubst > $tmp && mv $tmp $original

echo "Changed ${original} (${tmp})"
cat $original && echo "\n"

npm start &

nginx -g 'daemon off;'
