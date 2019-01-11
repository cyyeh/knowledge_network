$(function() {
  var json_path = "total_analysis.json";

  read_json_data(json_path, draw_network);

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

  function draw_network(data) {
    network_config = initialize_network_config(data);
  }

  function initialize_network_config(data) {
    
    return data;
  }
});