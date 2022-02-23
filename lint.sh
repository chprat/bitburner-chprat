#!/bin/bash
args=""
while getopts f flag
do
    case "${flag}" in
        f) args="--fix ";;
    esac
done
docker run -it --rm -v $(pwd):/data cytopia/eslint . $args
