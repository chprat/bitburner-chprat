#!/bin/bash

if [ ! -d node_modules ]; then
    docker run -it --rm -v $(pwd):/data --entrypoint="" cytopia/eslint /bin/sh -c "apk add npm && npm install"
fi

args=""

while getopts f flag
do
    case "${flag}" in
        f) args="--fix ";;
    esac
done

docker run -it --rm -v $(pwd):/data cytopia/eslint . $args

