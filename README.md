# dotIO graphs

This repo draws a knowledge graph from analysing [my blog posts](https://cyyeh.github.io/)

## How?

- Python: parse blog posts locally to generate network nodes and edges and save it to a json file
- JavaScript: a static website using Vis.js for generating a knowledge graph based on the saved json file

## Functionalities

- [x] draw the network: nodes are tags and articles
- [x] search the network based on tags