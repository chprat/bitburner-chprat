#!/bin/bash

if [ ! -d node_modules ]; then
    docker run --rm -v $(pwd):/code pipelinecomponents/eslint npm install
fi

args=""

while getopts f flag
do
    case "${flag}" in
        f) args="--fix ";;
    esac
done

docker run --rm -v $(pwd):/code pipelinecomponents/eslint eslint . --color $args
