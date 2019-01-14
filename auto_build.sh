#! /usr/bin/env bash
if [ "$1" == 0 ]; then
    python generate_graph_config.py && git add . && git commit -m "update json data file" && git push
else
    python generate_graph_config.py && git add . && git commit -m "$1" && git push
fi
