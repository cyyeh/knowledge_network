#! /usr/bin/env bash
if [ "$1" == "" ]; then
    python generate_graph_config.py && git add . && git commit -m "update total_analysis.json" && git push
else
    python generate_graph_config.py && git add . && git commit -m "$1" && git push
fi
