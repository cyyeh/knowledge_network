#! /usr/bin/env bash
commit_message = $1
if [[ -n "$commit_message" ]]; then
    python generate_graph_config.py && git add . && git commit -m "$1" && git push
else
    python generate_graph_config.py && git add . && git commit -m "update json data file" && git push
fi
