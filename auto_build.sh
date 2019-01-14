#! /usr/bin/env bash
default='update json data'
value=${1:-$default}
python generate_graph_config.py && git add . && git commit -m value && git push