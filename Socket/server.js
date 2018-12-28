var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let remotes = io.of("/remotes");
let masters = io.of("/masters");

remotes.on('connection', function(socket){
  console.log('remote socket connected');

  socket.on('disconnect', function(){
    console.log('remote socket disconnected');
  });

  socket.on('play', function(msg){
    masters.emit('play', '');
  });

  socket.on('pause', function(msg){
    masters.emit('pause', '');
  });

  socket.on('seekTo', function(msg){
    masters.emit('seekTo', msg);
  });


  socket.on('forwardClicked', function(msg){
    masters.emit('forwardClicked', '');
  });

  socket.on('backwardClicked', function(msg){
    masters.emit('backwardClicked', '');
    console.log("back");
  });

  socket.on("cueVideoRequest", function(data, position){
    masters.emit("cueVideoRequest", data, position);
  });

  socket.on("cueAfterCurrentRequest", function(data){
    masters.emit("cueAfterCurrentRequest", data);
  });

  socket.on("cueEndRequest", function(data){
    masters.emit("cueEndRequest", data);
  });
  
  socket.on("playVideoClicked", function(itemId){
    masters.emit("playVideoClicked", itemId);
  });

  socket.on("removeVideoClicked", function(itemId){
    masters.emit("removeVideoClicked", itemId);
  });

  socket.on("moveVideoPerformed", function(itemId, overItemId){
    masters.emit("moveVideoPerformed", itemId, overItemId);
  });

  socket.on("getPlayer", function(msg){
    masters.emit("getPlayer");
  });

  socket.on("getPlaylist", function(msg){
    masters.emit("getPlaylist");
  });

});


masters.on('connection', function(socket){
  console.log('master socket connected');

  socket.on('disconnect', function(){
    console.log('master socket disconnected');
  });


  socket.on('videoChange', function(msg){
    remotes.emit('videoChange', msg);
  });
  socket.on('stateChange', function(msg){
    remotes.emit('stateChange', msg);
  });
  socket.on('timeChange', function(d, t){
    remotes.emit('timeChange', d, t);
  });



  socket.on("cueVideo", function(itemId, data, position){
    remotes.emit("cueVideo", itemId, data, position);
  });

  socket.on("removeVideo", function(itemId){
    remotes.emit("removeVideo", itemId);
  });

  socket.on("moveVideo", function(itemId, newPosition){
    remotes.emit("moveVideo", itemId, newPosition);
  });

  socket.on("newPlaylist", function(order, map){
    remotes.emit("newPlaylist", order, map);
  })
});


http.listen(3000, function(){
  console.log('listening on *:3000');
}); 
