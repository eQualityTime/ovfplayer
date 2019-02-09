var iftttLib = (function () {
  var self = {};

  var sendRequest = function(action, key) {
    var url = "https://maker.ifttt.com/trigger/" + action + "/with/key/" + key
    var http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
  }

  self.action = function(context, config) {
    sendRequest(context.button.id, config['key']);
  }

  return self;
}());
