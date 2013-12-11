// "use strict";

(function () {
  // PRIVATE
  var events = {},
      session = null,
      client = null,
      pilvi = {};

  // PUBLIC
  pilvi.VERSION = '0.0.1';
  pilvi.CONNECTING = 0;
  pilvi.OPEN = 1;
  pilvi.CLOSING = 2;
  pilvi.CLOSED = 3;
  pilvi.readyState = pilvi.CONNECTING;

  pilvi.uuid = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a,b){return b=Math.random()*16,(a=="y"?b&3|8:b|0).toString(16)});
  }; 

  pilvi.setSession = function(uuid) {
    session = uuid;
    pilvi.trigger('setSession', uuid);
  };

  pilvi.getSession = function() {
    return session;
  };

  pilvi.getClient = function() {
    return client;
  };

  pilvi.trigger = function (event) {
    if (event in events === false) { return; }
    for (var i = 0; i < events[event].length; i++){
      events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  };

  // bind to event
  pilvi.on = function(event, fct) {
    events[event] = events[event] || [];
    events[event].push(fct);
  };

  // unbind to event
  pilvi.off = function(event, fct){
    if( event in events === false  ) return;
    events[event].splice(events[event].indexOf(fct), 1);
  };

  // upsert items to collection
  pilvi.set = function(collection, items, callback) {
    for(var i=0; i < items.length; i++) {
      if(items[i]['_id']==null || items[i]['_id']=='undefined') {
        items[i]['_id'] = pilvi.uuid();
      }
    }
    pilvi.trigger('set', collection, items, callback);
  };

  // get items that pass filter
  pilvi.get = function(collection, filter, callback) {
    pilvi.trigger('get', collection, filter, callback);
  }

  pilvi.getAll = function(callback) {
    pilvi.trigger('getAll', callback);
  }

  // delete items from collection that pass filter
  pilvi.delete = function(collection, filter, callback) {
    pilvi.trigger('delete', collection, filter, callback);
  };

  pilvi.push = function(envelope) {
    pilvi.trigger('push', envelope);
  };

  pilvi.pull = function(collection) {
    pilvi.trigger('pull', collection);
  };

  pilvi.send = function(type, message) {
    var envelope = {
      "from": pilvi.getClient(),
      "session": pilvi.getSession(),
      "type": type
    };
    if(message!=null) envelope.message = message;
    pilvi.trigger('send', envelope);
  };

  session = pilvi.uuid();
  client = pilvi.uuid();

  // assign at the end
  if ((typeof module) === 'undefined') {
    window.pilvi = pilvi;
  } else {
    module.exports = pilvi;
  }

}).call(this);





// TRANSPORT
(function () {

  var host = 'localhost';
  var ws = new WebSocket('ws://' + host + ':8888');
  var all = function(item){return true};

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