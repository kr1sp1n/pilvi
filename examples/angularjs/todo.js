var all = function(item){return true};

function TodoCtrl($scope) {
  
  pilvi.setSession("6a2ca71a-9a57-444b-95e4-bba4d21b2462");

  $scope.todos = []

  pilvi.get('todos', all, function(items){
    $scope.todos = items;
  });

  // {text:'learn angular', done:true},
  // {text:'build an angular app', done:false}];
 
  $scope.addTodo = function() {
    var item = {text:$scope.todoText, done:false};
    $scope.todos.push(item);
    pilvi.post('todos', [item]);
    $scope.todoText = '';
  };
 
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
 
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };
}