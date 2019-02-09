var iftttLib = (function () {
  var self = {};

  var sendRequest = function(trigger, key) {
    var url = "https://maker.ifttt.com/trigger/" + trigger + "/with/key/" + key
    var http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
  }

  self.trigger = function(context, config) {
    sendRequest(context.button.id, config['key']);
  }

  return self;
}());
