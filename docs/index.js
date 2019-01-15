$(function() {
  // variable declaration
  var json_path = "total_analysis.json";
  var categories_dict = {
    "Artificial Intelligence": {
      unicode: "\uf085",
      html: '<i class="fa fa-cogs fa-lg" aria-hidden="true"></i>'
    },
    "Computer Systems": {
      unicode: "\uf109",
      html: '<i class="fa fa-laptop fa-lg" aria-hidden="true"></i>'
    },
    "Data Structures & Algorithms": {
      unicode: "\uf15c",
      html: '<i class="fa fa-file-text fa-lg" aria-hidden="true"></i>',
    },
    "Mathematics": {
      unicode: "\uf1ec",
      html: '<i class="fa fa-calculator fa-lg" aria-hidden="true"></i>',
    },
    "Programming": {
      unicode: "\uf121",
      html: '<i class="fa fa-code fa-lg" aria-hidden="true"></i>',
    },
    "Software Engineering": {
      unicode: "\uf0c0",
      html: '<i class="fa fa-users fa-lg" aria-hidden="true"></i>',
    },
    "Learning": {
      unicode: "\uf02d",
      html: '<i class="fa fa-book fa-lg" aria-hidden="true"></i>',
    },
    "Research": {
      unicode: "\uf044",
      html: '<i class="fa fa-pencil-square-o fa-lg" aria-hidden="true"></i>'
    }
  };
  var nodes_dict = {};
  var tags_dict = {};
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
  var article_footer_element = document.getElementById("article-footer");
  var tag_button_state_on = false;
  var tag_panel_container = document.getElementById("tag-panel-container");
  var tag_panel_close_button = document.getElementById("tag-close-button");
  var tag_title_element = document.getElementById("tag-title");
  var tag_list_gorup_element = document.getElementById("tag-list-group");
  var body_element = document.getElementsByTagName("body")[0];
  var header_container_element = document.getElementById("header-container");
  var theme_button = document.getElementById("theme-button");
  var target_theme = 'cyyeh-knwlnet-theme';
  var vis_nodes, vis_edges;
  var article_nodes_index = {
    start: 0,
    end: 0
  };
  var highlightActive = false;
  var all_nodes;

  // detect theme
  if (window.localStorage.getItem(target_theme) === 'light') {
    update_theme('light');
  }

  // initialize_search_select
  $(search_select).selectpicker(); 
  // read_json_data => draw_network => reload_search_select
  read_json_data(json_path, draw_network, reload_search_select);

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

  tag_panel_close_button.addEventListener("click", function(event) {
    tag_panel_container.style.display = "none";
    tag_button_state_on = !tag_button_state_on;
  });

  // update theme
  function update_theme(target_theme) {
    if (target_theme === 'light') {
      body_element.classList.remove("w3-theme");
      header_container_element.classList.remove("w3-theme-l1");
      header_container_element.style.borderBottomColor = "#f1f1f1";
      theme_button.innerHTML = '<i class="fa fa-moon-o" aria-hidden="true"></i>';
      if (article_nodes_index['end']) {
        for (i = article_nodes_index['start']; i <= article_nodes_index['end']; i++) {
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
        for (i = article_nodes_index['start']; i <= article_nodes_index['end']; i++) {
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
      article_list_gorup_element.style.maxHeight = "303px";
      article_footer_element.style.display = "block";
      article_panel_container.style.display = "flex";
      article_title_element.innerHTML = categories_dict[node_data["category"]]["html"] + " " + node_data["title"];
      article_list_gorup_element.innerHTML = "";
      var tags_html = '<li class="list-group-item article-list-group-item">';
      node_data["tags"].forEach(function(element) {
        tags_html += '<span class="badge badge-primary" style="font-size: small; margin-right: 5px; margin-bottom: 5px;">'+ element +'</span>';
      });
      tags_html += "</li>"
      $(article_list_gorup_element).append(tags_html);
      $(article_list_gorup_element).append('<li class="list-group-item">'+ node_data["description"] +'</li></ul>');
      article_footer_element.innerHTML = "";
      $(article_footer_element).append('<a type="button" class="btn btn-primary" href="https://cyyeh.github.io/'+ node_data["link"] +'" style="-webkit-appearance: initial!important;" target="_blank">Read the article</a>');
    }

    article_button_state_on = !article_button_state_on;
  }

  // handle tag panel
  function handle_tag_panel(tag_name, connected_nodes_id) {
    if (tag_button_state_on) {
      tag_panel_container.style.display = "none";
    } else {
      tag_list_gorup_element.style.maxHeight = "357px";
      tag_panel_container.style.display = "flex";
      tag_title_element.innerHTML = tag_name;
      tag_list_gorup_element.innerHTML = "";
      connected_nodes_id.forEach(function(id) {
        var article_html = nodes_dict[id]['title'];
        $(tag_list_gorup_element).append('<li class="list-group-item"><div class="tag-panel-article-title" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">' + article_html + '</div><a id="article-'+ id +'"type="button" class="btn btn-primary btn-xs checkout-button" style="-webkit-appearance: initial!important; position: absolute; top: 10px; right: 10px;">Check out!</a></li>');
      }); 
    }

    tag_button_state_on = !tag_button_state_on;

    var checkout_buttons = document.getElementsByClassName("checkout-button");
    for (var i = 0; i < checkout_buttons.length; i++) {
      var article_id = checkout_buttons[i].id.split("-")[1];
      (function(index, article_id) {
        checkout_buttons[index].addEventListener("click", function(event) {
          handle_checkout_button(article_id);
        });
      })(i, article_id);
    }
  }

  // handle checkout button
  function handle_checkout_button(article_id) {
    handle_article_panel(nodes_dict[article_id]);
  }

  // handle search select
  function reload_search_select(network) {
    $(search_select).selectpicker('refresh');

    $(search_select).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
      var tag_node_id = clickedIndex - 1;
      var tag_node_list = [tag_node_id];
      var tag_node_position = network.getPositions(tag_node_list)[clickedIndex - 1];
      network.selectNodes(tag_node_list);
      network.moveTo({
        position: tag_node_position,
        scale: 1,
        animation: false
      });
      network_neighborhood_highlight(tag_node_id);
    });
  }

  // neighborhood highlight and gray out other nodes
  function network_neighborhood_highlight(node_id) {
    // if something is selected:
    if (!highlightActive) {
      highlightActive = true;
      var i,j;
      var selectedNode = [node_id];
      var degrees = 2;

      // mark all nodes as hard to read.
      for (var nodeId in all_nodes) {
        if (all_nodes[nodeId].icon) {
          all_nodes[nodeId].icon.color = 'rgba(200,200,200,0.5)';
        } else {
          all_nodes[nodeId].color = 'rgba(200,200,200,0.5)';
        }
        if (all_nodes[nodeId].hiddenLabel === undefined) {
          all_nodes[nodeId].hiddenLabel = all_nodes[nodeId].label;
          all_nodes[nodeId].label = undefined;
        }
      }
      var connectedNodes = network.getConnectedNodes(selectedNode);
      var allConnectedNodes = [];


      // get the second degree nodes
      for (i = 1; i < degrees; i++) {
        for (j = 0; j < connectedNodes.length; j++) {
          allConnectedNodes = allConnectedNodes.concat(network.getConnectedNodes(connectedNodes[j]));
        }
      }

      allConnectedNodes = Array.from(new Set(allConnectedNodes));

      // all second degree nodes get a different color and their label back
      for (i = 0; i < allConnectedNodes.length; i++) {
        all_nodes[allConnectedNodes[i]].color = 'orange';
        if (all_nodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
          all_nodes[allConnectedNodes[i]].label = all_nodes[allConnectedNodes[i]].hiddenLabel;
          all_nodes[allConnectedNodes[i]].hiddenLabel = undefined;
        }
      }

      // all first degree nodes get their own color and their label back
      for (i = 0; i < connectedNodes.length; i++) {
        all_nodes[connectedNodes[i] - 1].icon.color = 'green';
        if (window.localStorage.getItem(target_theme) === 'light') {
          all_nodes[connectedNodes[i] - 1].font = {
            color: 'black'
          };
        } else {
          all_nodes[connectedNodes[i] - 1].font = {
            color: 'white'
          };
        }
        if (all_nodes[connectedNodes[i] - 1].hiddenLabel !== undefined) {
          all_nodes[connectedNodes[i] - 1].label = all_nodes[connectedNodes[i] - 1].hiddenLabel;
          all_nodes[connectedNodes[i] - 1].hiddenLabel = undefined;
        }
      }

      // the main node gets its own color and its label back.
      all_nodes[selectedNode].color = 'orange';
      if (all_nodes[selectedNode].hiddenLabel !== undefined) {
        all_nodes[selectedNode].label = all_nodes[selectedNode].hiddenLabel;
        all_nodes[selectedNode].hiddenLabel = undefined;
      }
    }

    update_network();
  }

  function update_network() {
    // transform the object into an array
    var updateArray = [];
    for (nodeId in all_nodes) {
      if (all_nodes.hasOwnProperty(nodeId)) {
        updateArray.push(all_nodes[nodeId]);
      }
    }
    vis_nodes.update(updateArray); 
  }

  // use ajax to read json data
  function read_json_data(json_path, callback, second_callback) {
    $.ajax({
      type: "get",
      url: json_path,
      dataType: "json",
      success: function(data) {
        callback(data, second_callback);
      },
      error: function(xhr, status, error) {
        console.log("read json file status: " + status);
      }
    });
  }

  // draw network using vis.js
  function draw_network(data, callback) {
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

        tags_dict[index] = element;

        // add options to search select
        $(search_select).append("<option>"+ element +"</option>");
        
        tags_number += 1;
      });

      article_nodes_index['start'] = tags_number + 1;
      article_nodes_index['end'] = tags_number + Object.keys(posts_with_tags).length;

      Object.keys(posts_with_tags).forEach(function(element, index) {
        node_id = tags_number + index + 1
        nodes[element] = {
          id: node_id,
          label: element,
          group: 'article',
          icon: {
            face: 'FontAwesome',
            code: categories_dict[posts_with_tags[element]["category"]]["unicode"],
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
      width: '100%',
      layout: {
        randomSeed: 67443
      },
      physics: {
        timestep: 0.3
      }
    };
    var container = document.getElementById("network");

    network = new vis.Network(container, network_data, network_options);

    all_nodes = vis_nodes.get({returnType: "object"});

    network.on("click", function(params) {
      var node_id = params.nodes[0];
      if (nodes_dict[node_id]) {
        handle_article_panel(nodes_dict[node_id]);
      } else if (tags_dict[node_id]) {
        var connected_nodes = network.getConnectedNodes(node_id);
        handle_tag_panel(tags_dict[node_id], connected_nodes);
      } else {
        highlightActive = false;
        for (var nodeId in all_nodes) {
          if (all_nodes[nodeId].icon) {
            all_nodes[nodeId].icon.color = "green";
            if (window.localStorage.getItem(target_theme) === 'light') {
              all_nodes[nodeId].font = {
                color: 'black'
              };
            } else {
              all_nodes[nodeId].font = {
                color: 'white'
              };
            }
          } else {
            all_nodes[nodeId].color = "orange";
          }
          if (all_nodes[nodeId].hiddenLabel !== undefined) {
            all_nodes[nodeId].label = all_nodes[nodeId].hiddenLabel;
            all_nodes[nodeId].hiddenLabel = undefined;
          }
        }

        update_network();  
      }
    });
    network.on("hoverNode", function (params) {
      network.canvas.body.container.style.cursor = 'pointer';
    });
    network.on("blurNode", function (params) {
      network.canvas.body.container.style.cursor = 'default';
    });
    callback(network);
  }
});