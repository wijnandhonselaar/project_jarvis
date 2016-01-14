var theApp = angular.module("jukeboxApp", []);

theApp.controller('jukebox', ['$scope','socket' , function($scope, socket) {
 socket.on('connect', function(data){
  $scope.song = 'muse';
  socket.on('on', function() {
   play(false);
   $scope.$apply();
  });

  socket.on('stop', function() {
   stop();
   $scope.$apply();
  });

  socket.on('muse', function() {
   $scope.song="muse";
   play(true);
   $scope.$apply();
  });

  socket.on('parkway drive', function() {
   $scope.song="parkway drive";
   play(true);
   $scope.$apply();
  });

  socket.on('taylor swift', function() {
   $scope.song="taylor swift";
   play(true);
   $scope.$apply();
  });

  socket.on('pause', function() {
   pause();
  });

  socket.on('next', function() {
   next();
  });

  socket.on('previous', function() {
   previous();
  });
 });

 function play(stop) {
  if(stop == true){
   stop();
  }
  document.getElementById($scope.song).play();
 }

 function stop() {
  var elements = document.getElementsByTagName("audio");
  for(var i = 0; i < elements.length; i++){
   elements[i].pause();
   elements[i].currentTime = 0;
  }
 }

 function pause() {
  var elements = document.getElementsByTagName("audio");
  for(var i = 0; i < elements.length; i++){
   elements[i].pause();
  }
 }

 function next() {
  var elements = document.getElementsByTagName("audio");
  for (var i = 0; i < elements.length; i++) {
   if (elements[i].id == $scope.song) {
    elements[i].pause();
    elements[i].currentTime = 0;
    if (i < 2) {
     elements[i + 1].play();
     $scope.song = elements[i + 1].id;
    } else {
     elements[0].play();
     $scope.song = elements[0].id;
    }
    break;
   }
  }
 }

  function previous() {
   var elements = document.getElementsByTagName("audio");
   for (var i = 0; i < elements.length; i++) {
    if (elements[i].id == $scope.song) {
     elements[i].pause();
     elements[i].currentTime = 0;
     if (i > 0) {
      elements[i - 1].play();
      $scope.song = elements[i - 1].id;
     } else {
      elements[elements.length - 1].play();
      $scope.song = elements[elements.length - 1].id;
     }
     break;
    }
   }
 }

}]);
