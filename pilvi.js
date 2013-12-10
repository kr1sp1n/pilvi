// "use strict";

(function () {
    // PRIVATE
    var events = {},
        session = null,
        client = null,

        trigger = function (event) {
            if (event in events === false) { return; }
            for (var i = 0; i < events[event].length; i++){
                events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        };

  // PUBLIC
  var pilvi = {}
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
    trigger('setSession', uuid);
  };

  pilvi.getSession = function() {
    return session;
  };

  pilvi.getClient = function() {
    return client;
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
    trigger('set', collection, items, callback);
  };

  // get items that pass filter
  pilvi.get = function(collection, filter, callback) {
    trigger('get', collection, filter, callback);
  }

  // delete items from collection that pass filter
  pilvi.delete = function(collection, filter, callback) {
    trigger('delete', collection, filter, callback);
  };

  pilvi.push = function(collection, items) {
    trigger('push', collection, items);
  }

  session = pilvi.uuid();
  client = pilvi.uuid();

  // assign at the end
  if ((typeof module) === 'undefined') {
    window.pilvi = pilvi;
  } else {
    module.exports = pilvi;
  }

}).call(this);