
var host = 'localhost';
var ws = new WebSocket('ws://' + host + ':8888');
var all = function(item){return true};

pilvi.send = function(type, message) {
  var data = {
    "from": pilvi.getClient(),
    "session": pilvi.getSession(),
    "type": type
  };
  if(message!=null) data.message = message;
  ws.send(JSON.stringify(data));
};

ws.onmessage = function(event) {
  var data = JSON.parse(event.data);
  switch(data.type) {
    case "pull":
      console.log("PULL FROM " + data.from);
      var db = $.jStorage.get(pilvi.getSession()) || {};
      pilvi.send("push", db);
    break;
    case "push":
      console.log("PUSH FROM " + data.from);
      // $.jStorage.set(pilvi.getSession(), data.message);
      console.log($.jStorage.get(pilvi.getSession()));

    break;
  }

};

ws.onopen = function(e){
  pilvi.send("pull");
};

ws.onerror = function(err) {
  console.log("ERR");
  console.error(err);
};

// pilvi.on('setSession', function(sessionId){
//   // fetch data from all clients
//   console.log("readyState: " + ws.readyState);
// });

pilvi.on('post', function(collection, items){
  var db = $.jStorage.get(pilvi.getSession()) || {};
  db[collection] = db[collection] || [];
  for (var i = 0; i < items.length; i++) {
    db[collection].push(items[i]);
  }
  $.jStorage.set(key, db);
});

pilvi.on('get', function(collection, filter, callback){
  var db = $.jStorage.get(pilvi.getSession()) || {};
  var table = db[collection] || [];
  var items = [];
  for (var i = 0; i < table.length; i++) {
    if (filter(table[i])) items.push(table[i]);
  }
  callback(items);
});

pilvi.on('delete', function(collection, filter, callback){
  var db = $.jStorage.get(pilvi.getSession()) || {};
  var table = db[collection] || [];
  var items = []
  for (var i = 0; i < table.length; i++) {
    if (filter(table[i])) items.push(table.splice(i, 1)[0]);
  }
  callback(items);
});