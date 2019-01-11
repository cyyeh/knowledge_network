$(function() {
  var json_path = "total_analysis.json";
  var categories_dict_unicode = {
    "Artificial Intelligence": "\uf085",
    "Computer Systems": "\uf109",
    "Data Structures & Algorithms": "\uf15c",
    "Mathematics": "\uf1ec",
    "Programming": "\uf121",
    "Software Engineering": "\uf0c0",
    "Learning": "\uf02d",
    "Research": "\uf044"
  };
  var categories_dict_html = {
    "Artificial Intelligence": '<i class="fa fa-cogs fa-lg" aria-hidden="true"></i>',
    "Computer Systems": '<i class="fa fa-laptop fa-lg" aria-hidden="true"></i>',
    "Data Structures & Algorithms": '<i class="fa fa-file-text fa-lg" aria-hidden="true"></i>',
    "Mathematics": '<i class="fa fa-calculator fa-lg" aria-hidden="true"></i>',
    "Programming": '<i class="fa fa-code fa-lg" aria-hidden="true"></i>',
    "Software Engineering": '<i class="fa fa-users fa-lg" aria-hidden="true"></i>',
    "Learning": '<i class="fa fa-book" aria-hidden="true"></i>',
    "Research": '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>'
  };
  var links_dict = {};
  var descriptions_dict = {};
  var nodes_dict = {};
  var help_button = document.getElementById("help-button");
  var help_button_state_on = false;
  var help_panel_container = document.getElementById("help-panel-container");
  var help_panel_close_button = document.getElementById("panel-close-button");
  var search_select = document.getElementById("search-select");
  var article_button_state_on = false;
  var article_panel_container = document.getElementById("article-panel-container");
  var article_pancel_close_button = document.getElementById("article-close-button");
  var article_title_element = document.getElementById("article-title");
  var article_list_gorup_element = document.getElementById("article-list-group");

  read_json_data(json_path, draw_network);

  // handle help panel
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

  // handle article panel
  function handle_article_panel(node_data) {
    if (article_button_state_on) {
      article_panel_container.style.display = "none";
    } else {
      article_panel_container.style.display = "flex";
      article_title_element.innerHTML = categories_dict_html[node_data["category"]] + " " + node_data["title"];
      article_list_gorup_element.innerHTML = "";
      var tags_html = '<li class="list-group-item" style="display: grid;">';
      node_data["tags"].forEach(function(element) {
        tags_html += '<span class="badge badge-primary" style="font-size: small; margin-bottom: 5px;">'+ element +'</span>';
      });
      tags_html += "</li>"
      $(article_list_gorup_element).append(tags_html);
      $(article_list_gorup_element).append('<li class="list-group-item">'+ node_data["description"] +'</li>');
      $(article_list_gorup_element).append('<li class="list-group-item" style="text-align: center;"><a type="button" class="btn btn-primary" href="https://cyyeh.github.io/'+ node_data["link"] +'" style="-webkit-appearance: initial!important;" target="_blank">Read the article</a></li>');
    }

    article_button_state_on = !article_button_state_on;
  }

  article_pancel_close_button.addEventListener("click", function(event) {
    article_panel_container.style.display = "none";
    article_button_state_on = !article_button_state_on;
  });

  // handle search select
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
        console.log(data);
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
      if (nodes_dict[node_id]) {
        handle_article_panel(nodes_dict[node_id]);
      }
      /*
      if (link) {
        window.open("/" + link);
      }*/
    });
    network.on("hoverNode", function (params) {
      if (nodes_dict[params.node]) {
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
    var nodes = {};
    var edges = [];
    
    // generate nodes dictionary with label as key, vis node as value
    tags.forEach(function(element, index) {
      nodes[element] = {
        id: index,
        label: element,
        group: 'tag'
      };

      // add options to search select
      $(search_select).append("<option>"+ element +"</option>");
      
      tags_number += 1;
    });

    Object.keys(posts_with_tags).forEach(function(element, index) {
      node_id = tags_number + index + 1
      nodes[element] = {
        id: node_id,
        label: element,
        group: 'article',
        icon: {
          face: 'FontAwesome',
          code: categories_dict_unicode[posts_with_tags[element]["category"]],
          size: 60,
          color: 'green'
        },
        shape: 'icon',
        font: {
          color: 'white'
        }
      };
      nodes_dict[node_id] = {
        "link": posts_with_tags[element]["link"],
        "description": posts_with_tags[element]["description"],
        "category": posts_with_tags[element]["category"],
        "title": element,
        "tags": posts_with_tags[element]["tags"]
      };
    });    

    // generate edges
    Object.keys(posts_with_tags).forEach(function(key) {
      posts_with_tags[key]["tags"].forEach(function(tag) {
        edges.push({
          from: nodes[key]["id"],
          to: nodes[tag]["id"]
        });
      });
    });

    // create an array with nodes
    var vis_nodes = new vis.DataSet(Object.values(nodes));

    // create an array with edges
    var vis_edges = new vis.DataSet(edges);

    return {
      nodes: vis_nodes,
      edges: vis_edges
    };
  }
});