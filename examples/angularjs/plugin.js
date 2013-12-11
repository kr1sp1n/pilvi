// TRANSPORT
(function () {

  var host = 'localhost';
  var ws = false;
  var all = function(item){return true};

  pilvi.on('connect', function(endpoint, callback){
    
    ws = new WebSocket(endpoint);

    pilvi.on('send', function(envelope) {
      ws.send(JSON.stringify(envelope));
    });

    ws.onmessage = function(event) {
      var envelope = JSON.parse(event.data);
      var items = [];
      switch(envelope.type) {
        case "pull":
          console.log("PULL FROM " + envelope.from);
          pilvi.getAll(function(all) {
            pilvi.send("push", all);
          });
          
        break;
        case "push":
          console.log("PUSH FROM " + envelope.from);
          pilvi.push(envelope);
          // console.log(envelope.message);
        break;
      }

    };

    ws.onopen = function(e){
      if(callback!=null) {
        callback();
      }
      pilvi.send("pull");
    };

    ws.onerror = function(err) {
      console.log("ERR");
      console.error(err);
    };

    pilvi.on('set', function(collection, items, callback){
      var db = {};
      db[collection] = items;
      pilvi.send("push", db);
    });

  });

}).call(this);

// STORAGE
(function () {

  var updateStorage = function(collection, items) {

    var key = pilvi.getSession(),
        db = $.jStorage.get(key) || {},
        table = db[collection] || [],
        item = null;


    for (var i = 0; i < items.length; i++) {
      item = items[i];

      // check if update!
      var found = false;
      for (var j = 0; j < table.length; j++) {
        if (table[j]['_id'] === item['_id']) {
          // replace or merge?
          // update!
          table[j] = item;
          found = true;
        }
      }

      if(!found) {
        // insert!
        table.push(item);
      }

    }

    db[collection] = table;
    $.jStorage.set(key, db);
  }

  pilvi.on('set', function(collection, items, callback){
    updateStorage(collection, items);
    if(callback!=null) {
      callback();
    }
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

  pilvi.on('getAll', function(callback){
    var db = $.jStorage.get(pilvi.getSession()) || {};
    callback(db);
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

  pilvi.on('push', function(envelope){
    for(var collection in envelope.message) {
      items = envelope.message[collection]
      updateStorage(collection, items);
    }
    pilvi.trigger('update', collection);
  });

}).call(this);