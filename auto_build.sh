#! /usr/bin/env bash
if [[ -n "$1" ]]; then
    python generate_graph_config.py && git add . && git commit -m $1 && git push
else
    python generate_graph_config.py && git add . && git commit -m "update json data" && git push
fi
