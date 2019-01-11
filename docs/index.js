$(function() {
  var json_path = "total_analysis.json";
  var categories_dict = {
    "Artificial Intelligence": "\uf085",
    "Computer Systems": "\uf109",
    "Data Structures & Algorithms": "\uf15c",
    "Mathematics": "\uf1ec",
    "Programming": "\uf121",
    "Software Engineering": "\uf0c0",
    "Learning": "\uf02d",
    "Research": "\uf044"
  };
  var links_dict = {};

  read_json_data(json_path, draw_network);

  // handle help panel
  var help_button = document.getElementById("help-button");
  var help_button_state_on = false;
  var help_panel_container = document.getElementById("help-panel-container");
  var help_panel_close_button = document.getElementById("panel-close-button");
  help_button.addEventListener("click", function(event) {
    if (help_button_state_on) {
      help_panel_container.style.display = "none";
    } else {
      help_panel_container.style.display = "flex";
    }

    help_button_state_on = !help_button_state_on;
  });

  help_panel_close_button.addEventListener("click", function(event) {
    help_panel_container.style.display = "none";
    help_button_state_on = !help_button_state_on;
  });

  // handle search select
  var search_select = document.getElementById("search-select");
  function initialize_search_select(tags, network) {
    search_select.style.display = "block";
    $(search_select).selectpicker();

    $(search_select).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      var node = [clickedIndex - 1];
      var node_position = network.getPositions(node)[clickedIndex - 1];
      network.selectNodes(node);
      network.moveTo({
        position: node_position,
        scale: 1,
        animation: false
      });
    });
  }

  // use ajax to read json data
  function read_json_data(json_path, callback) {
    $.ajax({
      type: "get",
      url: json_path,
      dataType: "json",
      success: function(data) {
        callback(data);
      },
      error: function(xhr, status, error) {
        console.log(status);
      }
    });
  }

  // draw network using vis.js
  function draw_network(data) {
    var network_data = initialize_network_data(data);
    var network_options = {
      groups: {
        article: {
          color: {
            background: 'white',
            border: 'gray'
          },
          borderWidth: 2,
        },
        tag: {
          color: {
            background: 'orange',
            border: 'orange'
          },
          borderWidth: 3,
          shape: 'box'
        }
      },
      interaction: {
        hover: true,
        hideEdgesOnDrag: true
      },
      autoResize: true,
      height: '100%',
      width: '100%'
    };
    var container = document.getElementById("network");

    network = new vis.Network(container, network_data, network_options);
    network.on("click", function(params) {
      var node_id = params.nodes[0];
      var link = links_dict[node_id];
      if (link) {
        window.open("/" + link);
      }
    });
    network.on("hoverNode", function (params) {
      if (links_dict[params.node]) {
        network.canvas.body.container.style.cursor = 'pointer';
      }
    });
    network.on("blurNode", function (params) {
      network.canvas.body.container.style.cursor = 'default';
    });
    initialize_search_select(data["tags"], network);
  }

  // generate network nodes and edges
  function initialize_network_data(data) {
    var posts_with_tags = data["posts_with_tags"];
    var tags_number = 0;
    var tags = data["tags"];
    var nodes_dict = {};
    var edges = [];
    
    // generate nodes dictionary with label as key, vis node as value
    tags.forEach(function(element, index) {
      nodes_dict[element] = {
        id: index,
        label: element,
        group: 'tag'
      };

      // add options to search select
      $(search_select).append("<option>"+ element +"</option>");
      
      tags_number += 1;
    });

    Object.keys(posts_with_tags).forEach(function(element, index) {
      nodes_dict[element] = {
        id: tags_number + index + 1,
        label: element,
        group: 'article',
        icon: {
          face: 'FontAwesome',
          code: categories_dict[posts_with_tags[element]["category"]],
          size: 60,
          color: 'green'
        },
        shape: 'icon',
        font: {
          color: 'white'
        }
      };
      links_dict[tags_number + index + 1] = posts_with_tags[element]["link"];
    });    

    // generate edges
    Object.keys(posts_with_tags).forEach(function(key) {
      posts_with_tags[key]["tags"].forEach(function(tag) {
        edges.push({
          from: nodes_dict[key]["id"],
          to: nodes_dict[tag]["id"]
        });
      });
    });

    // create an array with nodes
    var vis_nodes = new vis.DataSet(Object.values(nodes_dict));

    // create an array with edges
    var vis_edges = new vis.DataSet(edges);

    return {
      nodes: vis_nodes,
      edges: vis_edges
    };
  }
});