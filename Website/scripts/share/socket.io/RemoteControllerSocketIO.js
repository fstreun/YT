/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

let RemoteControllerSocketIO = function() {

  const HOST = "http://localhost:3000";

  let remoteSocket = null;

  let remotePlayer = null;
  let remotePlaylist = null;

  function init(newRemotePlayer, newRemotePlaylist){
    remotePlayer = newRemotePlayer;
    remotePlaylist = newRemotePlaylist;

    // 2. This code loads code
    let tag = document.createElement('script');
    tag.src = "http://localhost:3000/socket.io/socket.io.js";
    tag.onload = function(){
      initSockets();
    }

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function initSockets(){

    remoteSocket = io(HOST + "/remotes");

    remoteSocket.on("dataChange", function(msg){
      dataChange(msg);
    });
    remoteSocket.on("stateChange", function(msg){
      stateChange(msg);
    });
    remoteSocket.on("timeChange", function(t, d){
      timeChange(t, d);
    });

    remoteSocket.on("addToPlaylist", function(data, itemId, position){
      addConfirmed(data,itemId, position);
    });
    
    remoteSocket.on("removeFromPlaylist", function(itemId){
      removeConfirmed(itemId);
    });

    remoteSocket.on("moveInPlaylist", function(itemId, newPosition){
      moveConfirmed(itemId, newPosition);
    });

    remoteSocket.on("setCurrent", function(itemId){
      setCurrent(itemId);
    });
  }

  /**
   * Plays current loaded video
   */
  function play(){
    remoteSocket.emit("play", "");
  }

  /**
   * Pauses current loaded video
   */
  function pause(){
    remoteSocket.emit("pause", "");
  }

  /**
   * Loads next video in the Playlist
   */
  function forward(){
    remoteSocket.emit("forward", "");
  }

  /**
   * Load previous video from the Playlist
   */
  function backward(){
    remoteSocket.emit("backward", "");
  }

  function seekTo(time){
    remoteSocket.emit("seekTo", time);
  }

  function playVideo(itemId){
    remoteSocket.emit("playVideo", itemId);
  }

  function addToPlaylist(data, position){
    remoteSocket.emit("addToPlaylist", data, position);
  }

  function removeFromPlaylist(itemId){
    remoteSocket.emit("removeFromPlaylist", itemId);
  }

  function moveInPlaylist(itemId, newPosition){
    remoteSocket.emit("moveInPlaylist", itemId, newPosition);
  }


  
  function dataChange(data){
    remotePlayer.dataChange(data);
  }

  function stateChange(state){
    remotePlayer.stateChange(state);
  }

  function timeChange(time, duration){
    remotePlayer.timeChange(time, duration);
  }

  
  function addConfirmed(data, itemId, position){
    remotePlaylist.addConfirmed(data, itemId, position);
  }

  function removeConfirmed(itemId){
    remotePlaylist.removeConfirmed(itemId);
  }

  function moveConfirmed(itemId, newPosition){
    remotePlaylist.moveConfirmed(itemId, newPosition);
  }

  function setCurrent(itemId){
    remotePlaylist.setCurrent(itemId);
  }


  return {
    init:init,
    play:play,
    pause:pause,
    forward:forward,
    backward:backward,
    seekTo:seekTo,
    playVideo:playVideo,
    addToPlaylist:addToPlaylist,
    removeFromPlaylist:removeFromPlaylist,
    moveInPlaylist:moveInPlaylist
  };

}();