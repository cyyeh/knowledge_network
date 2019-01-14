#! /usr/bin/env bash
python generate_graph_config.py && git add . && git commit -m [$1 || "update json data"] && git push