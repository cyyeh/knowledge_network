$(function() {
  // variable declaration
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
  var body_element = document.getElementsByTagName("body")[0];
  var header_container_element = document.getElementById("header-container");
  var theme_button = document.getElementById("theme-button");
  var target_theme = 'cyyeh-knwlnet-theme';
  var vis_nodes, vis_edge;
  var article_nodes_index = {
    start: 0,
    end: 0
  };

  // detect theme
  if (window.localStorage.getItem(target_theme) === 'light') {
    update_theme('light');
  }

  $(search_select).selectpicker();
  read_json_data(json_path, draw_network);

  // button event listeners
  theme_button.addEventListener("click", function(event) {
    if (theme_button.innerHTML.includes("sun")) {
      window.localStorage.setItem(target_theme, "light");
      update_theme('light');
    } else {
      window.localStorage.setItem(target_theme, "dark");
      update_theme('dark');
    }
  });

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

  article_pancel_close_button.addEventListener("click", function(event) {
    article_panel_container.style.display = "none";
    article_button_state_on = !article_button_state_on;
  });

  // update theme
  function update_theme(target_theme) {
    if (target_theme === 'light') {
      body_element.classList.remove("w3-theme");
      header_container_element.classList.remove("w3-theme-l1");
      header_container_element.style.borderBottomColor = "#f1f1f1";
      theme_button.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i>';
      if (article_nodes_index['end']) {
        for (i = article_nodes_index['start'], i < article_nodes_index['end']; i++;) {
          var article_node = vis_nodes.get(i);
          article_node.font = {
            color: 'black'
          };
          vis_nodes.update(article_node);
        }
      }
    } else {
      body_element.classList.add("w3-theme");
      header_container_element.classList.add("w3-theme-l1");
      header_container_element.style.borderBottomColor = "black";
      theme_button.innerHTML = '<i class="fa fa-sun-o" style="color: white;" aria-hidden="true"></i>';
      if (article_nodes_index['end']) {
        for (i = article_nodes_index['start'], i < article_nodes_index['end']; i++;) {
          var article_node = vis_nodes.get(i);
          article_node.font = {
            color: 'white'
          };
          vis_nodes.update(article_node);
        }
      }
    }
  }

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

  // handle search select
  function initialize_search_select(tags, network) {
    $(search_select).selectpicker('refresh');

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
        console.log("read json file status: " + status);
      }
    });
  }

  // draw network using vis.js
  function draw_network(data) {
    var article_node_color = 'white';
    if (window.localStorage.getItem(target_theme) === 'light') {
      article_node_color = 'black';
    }

    var network_data = initialize_network_data(data);
    var network_options = {
      groups: {
        article: {
          font: {
            color: article_node_color
          }
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

    article_nodes_index['start'] = tags_number + 1;
    article_nodes_index['end'] = Object.keys(posts_with_tags).length + Object.keys(tags).length;

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
        shape: 'icon'
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
    vis_nodes = new vis.DataSet(Object.values(nodes));

    // create an array with edges
    vis_edges = new vis.DataSet(edges);

    return {
      nodes: vis_nodes,
      edges: vis_edges
    };
  }
});