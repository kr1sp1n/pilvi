(function(){

  // PRIVATE
  var events = {};
  
  trigger = function(event /* , args... */){
    if( event in events === false  ) return;
    for(var i = 0; i < events[event].length; i++){
      events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }

  uuid = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a,b){return b=Math.random()*16,(a=="y"?b&3|8:b|0).toString(16)});
  };    
  
  var session = uuid();

  // PUBLIC
  var pilvi = {}
  pilvi.VERSION = '0.0.1';

  pilvi.setSession = function(uuid) {
    session = uuid;
  };

  pilvi.getSession = function() {
    return session;
  }

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

  // add items to collection
  pilvi.post = function(collection, items, callback) {
    trigger('post', collection, items, callback);
  };

  // delete items from collection that pass filter
  pilvi.delete = function(collection, filter, callback) {
    trigger('delete', collection, filter, callback);
  };

  // replace items in collection that pass filter
  pilvi.put = function(collection, filter) {
    trigger('put', collection, filter);
  };

  // modify properties of items of collection that pass filter
  pilvi.patch = function(collection, filter) {
    trigger('patch', collection, filter);
  };

  // get items that pass filter
  pilvi.get = function(collection, filter, callback) {
    trigger('get', collection, filter, callback);
  }

  // assign at the end
  if ((typeof module) === 'undefined') {
    window.pilvi = pilvi;
  } else {
    module.exports = pilvi;
  }

}).call(this);