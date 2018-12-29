let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname + "/../ClientSide"));

app.get('/', function (req, res) {
  res.sendFile('index.html', {root: __dirname+'/../ClientSide'});
});

app.get('/:masterId', function(req, res){
  const masterId = req.params.masterId;
  res.sendFile('remote.html', {root: __dirname+'/../ClientSide'});
});

let remotes = io.of("/remotes");
let masters = io.of("/masters");

remotes.on('connection', function (socket) {
  console.log('remote socket connected');
  const masterId = socket.handshake.query.masterId;
  const remoteRoomId = getRemoteRoomId(masterId);

  socket.join(remoteRoomId);
  console.log('joined master: ' + masterId);

  socket.on('play', function (msg) {
    masters.to(masterId).emit('play', '');
  });

  socket.on('pause', function (msg) {
    masters.to(masterId).emit('pause', '');
  });

  socket.on('seekTo', function (msg) {
    masters.to(masterId).emit('seekTo', msg);
  });


  socket.on('forwardClicked', function (msg) {
    masters.to(masterId).emit('forwardClicked', '');
  });

  socket.on('backwardClicked', function (msg) {
    masters.to(masterId).emit('backwardClicked', '');
  });

  socket.on("cueVideoRequest", function (data, position) {
    masters.to(masterId).emit("cueVideoRequest", data, position);
  });

  socket.on("cueAfterCurrentRequest", function (data) {
    masters.to(masterId).emit("cueAfterCurrentRequest", data);
  });

  socket.on("cueEndRequest", function (data) {
    masters.to(masterId).emit("cueEndRequest", data);
  });

  socket.on("playVideoClicked", function (itemId) {
    masters.to(masterId).emit("playVideoClicked", itemId);
  });

  socket.on("removeVideoClicked", function (itemId) {
    masters.to(masterId).emit("removeVideoClicked", itemId);
  });

  socket.on("moveVideoPerformed", function (itemId, overItemId) {
    masters.to(masterId).emit("moveVideoPerformed", itemId, overItemId);
  });

  socket.on("getPlayer", function (msg) {
    masters.to(masterId).emit("getPlayer");
  });

  socket.on("getPlaylist", function (msg) {
    masters.to(masterId).emit("getPlaylist");
  });

  socket.on('disconnect', function () {
    console.log('remote socket disconnected');
  });

});


masters.on('connection', function (socket) {
  console.log('master socket connected');
  const masterId = socket.handshake.query.masterId;
  const remoteRoomId = getRemoteRoomId(masterId);

  socket.join(masterId);
  console.log('master joined room: ' + masterId);

  socket.on('videoChange', function (msg) {
    remotes.to(remoteRoomId).emit('videoChange', msg);
  });
  socket.on('stateChange', function (msg) {
    remotes.to(remoteRoomId).emit('stateChange', msg);
  });
  socket.on('timeChange', function (d, t) {
    remotes.to(remoteRoomId).emit('timeChange', d, t);
  });



  socket.on("cueVideo", function (itemId, data, position) {
    remotes.to(remoteRoomId).emit("cueVideo", itemId, data, position);
  });

  socket.on("removeVideo", function (itemId) {
    remotes.to(remoteRoomId).emit("removeVideo", itemId);
  });

  socket.on("moveVideo", function (itemId, newPosition) {
    remotes.to(remoteRoomId).emit("moveVideo", itemId, newPosition);
  });

  socket.on("newPlaylist", function (order, map) {
    remotes.to(remoteRoomId).emit("newPlaylist", order, map);
  });

  socket.on('disconnect', function () {
    console.log('master socket disconnected');
  });
});


http.listen(3000, function () {
  console.log('listening on *:3000');
});


function getRemoteRoomId(masterId) {
  return "RemoteRoomOf: " + masterId;
}