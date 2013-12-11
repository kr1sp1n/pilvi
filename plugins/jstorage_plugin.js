(function () {

  var host = 'localhost';
  var ws = new WebSocket('ws://' + host + ':8888');
  var all = function(item){return true};

  pilvi.on('send', function(envelope) {
    ws.send(JSON.stringify(envelope));
  });

  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);
    var items = [];
    switch(data.type) {
      case "pull":
        console.log("PULL FROM " + data.from);
        var db = $.jStorage.get(pilvi.getSession()) || {};
        pilvi.send("push", db);
      break;
      case "push":
        console.log("PUSH FROM " + data.from);
        for(var collection in data.message) {
          items = data.message[collection]
          updateStorage(collection, items);
          pilvi.push(collection, items);
        }
        // console.log(data.message);
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

  var updateStorage = function(collection, items) {
    var key = pilvi.getSession(),
        db = $.jStorage.get(key) || {},
        table = db[collection] || [],
        item = null;


    for (var i = 0; i < items.length; i++) {
      item = items[i];

      if(item['_id']) {
        // check for update!
        var found = false;
        for (var j = 0; j < table.length; j++) {
          if (table[j]['_id'] === item['_id']) {
            // replace or merge?
            table[j] = item;
            found = true;
          }
        }

        if(!found) {
          table.push(item);
        }

      } else {
        // insert!
        item['_id'] = pilvi.uuid();
        table.push(items[i]);
      }
    }

    db[collection] = table;
    $.jStorage.set(key, db);
  }

  // pilvi.on('setSession', function(sessionId){
  //   // fetch data from all clients
  //   console.log("readyState: " + ws.readyState);
  // });

  pilvi.on('set', function(collection, items, callback){
    updateStorage(collection, items);
    var db = {};
    db[collection] = items;
    pilvi.send("push", db);
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

}).call(this);