todoApp = angular.module( "todoApp", []);

todoApp.service('Todo', ['$rootScope', function($rootScope){

  pilvi.setSession("6a2ca71a-9a57-444b-95e4-bba4d21b2462");

  var service = {
    todos : [],
    addTodo: function(item) {
      service.todos.push(item);
      $rootScope.$broadcast('todos.update');
      pilvi.set('todos', [angular.copy(item)]);
    },
    getAll: function() {
      pilvi.get('todos', all, function(items){
        service.todos = angular.copy(items);
        $rootScope.$broadcast('todos.update');
      });
    }
  };

  pilvi.on('push', function(collection, items){
    if(collection==='todos') {
      service.getAll();
    }
  });

  service.getAll();

  return service;

}]);

var all = function(item){return true};

var TodoCtrl = ['$scope', 'Todo', function($scope, Todo){
  
  $scope.todos = Todo.todos;

  $scope.addTodo = function() {
    var item = {text:$scope.todoText, done:false};
    Todo.addTodo(item);
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

  $scope.$on('todos.update', function(event){
    console.log("UPDATE");
    
    $scope.todos = Todo.todos;
  });

}];

todoApp.controller("todos.list", TodoCtrl);

// function TodoCtrl($scope) {
  
  

//   $scope.todos = [];

//   $scope.$watch('todo', function(x){
//     // console.log(x);
//   });

//   $scope.getAll = function() {
//     pilvi.get('todos', all, function(items){
      
//       $scope.todos = angular.copy(items);
//       $scope.$apply();
//     });
//   };

//   $scope.getAll();

//   pilvi.on('push', function(collection, items){
//     if(collection==='todos') {
//       $scope.getAll();
//     }
//   });

//   // {text:'learn angular', done:true},
//   // {text:'build an angular app', done:false}];
 
//   $scope.addTodo = function() {
//     var item = {text:$scope.todoText, done:false};
//     $scope.todos.push(item);
//     pilvi.set('todos', [angular.copy(item)]);
//     $scope.todoText = '';
//   };
 
//   $scope.remaining = function() {
//     var count = 0;
//     angular.forEach($scope.todos, function(todo) {
//       count += todo.done ? 0 : 1;
//     });
//     return count;
//   };
 

// }