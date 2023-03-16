#!/bin/bash

if [ $# -ne 1 ]; then
    echo "No arguments supplied, you need to specify the git commit SHA1" \
         "from which the definitions will be downloaded!"
    exit -1
fi

BITBURNER_SHA1=$1
wget "https://raw.githubusercontent.com/bitburner-official/bitburner-src/$BITBURNER_SHA1/src/ScriptEditor/NetscriptDefinitions.d.ts"
