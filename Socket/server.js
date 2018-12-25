var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('here you get the socket io library!');
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

  socket.on('forward', function(msg){
    masters.emit('forward', '');
  });

  socket.on('backward', function(msg){
    masters.emit('backward', '');
  });

  socket.on('seekTo', function(msg){
    masters.emit('seekTo', msg);
  });

  socket.on('playVideo', function(msg){
    masters.emit('playVideo', msg);
  });


  socket.on("addToPlaylist", function(data, position){
    masters.emit("addToPlaylist", data, position);
  });

  socket.on("removeFromPlaylist", function(itemId){
    masters.emit("removeFromPlaylist", itemId);
  });

  socket.on("moveInPlaylist", function(itemId, newPosition){
    masters.emit("moveInPlaylist", itemId, newPosition);
  });

});


masters.on('connection', function(socket){
  console.log('master socket connected');

  socket.on('disconnect', function(){
    console.log('master socket disconnected');
  });


  socket.on('dataChange', function(msg){
    remotes.emit('dataChange', msg);
  });
  socket.on('stateChange', function(msg){
    remotes.emit('stateChange', msg);
  });
  socket.on('timeChange', function(d, t){
    remotes.emit('timeChange', d, t);
  });



  socket.on("addToPlaylist", function(data, itemId, position){
    remotes.emit("addToPlaylist", data, itemId, position);
  });

  socket.on("removeFromPlaylist", function(itemId){
    remotes.emit("removeFromPlaylist", itemId);
  });

  socket.on("moveInPlaylist", function(itemId, newPosition){
    remotes.emit("moveInPlaylist", itemId, newPosition);
  });

  socket.on("setCurrent", function(position){
    remotes.emit("setCurrent", position);
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
}); 
