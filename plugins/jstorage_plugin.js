
var host = 'localhost';
var ws = new WebSocket('ws://' + host + ':8888');

ws.onmessage = function (event) {
  console.log(event.data);
};

pilvi.on('post', function(collection, items){
  var key = pilvi.getSession() + "::" + collection;
  arr = $.jStorage.get(key) || [];
  for (var i = 0; i < items.length; i++) {
    arr.push(items[i]);
  }
  $.jStorage.set(key, arr);
});

pilvi.on('get', function(collection, filter, callback){
  var key = pilvi.getSession() + "::" + collection;
  var arr = $.jStorage.get(key) || [];
  var items = [];
  for (var i = 0; i < arr.length; i++) {
    if (filter(arr[i])) items.push(arr[i]);
  }
  callback(items);
});

pilvi.on('delete', function(collection, filter, callback){
  var key = pilvi.getSession() + "::" + collection;
  var arr = $.jStorage.get(key) || [];
  var items = []
  for (var i = 0; i < arr.length; i++) {
    if (filter(arr[i])) items.push(arr.splice(i, 1)[0]);
  }
  callback(items);
});