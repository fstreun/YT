/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

const RemoteControllerSocketIO = function() {

  let remoteSocket = null;
  let masterId = null;

  let remotePlayer = null;
  let remotePlaylist = null;

  function init(newRemotePlayer, newRemotePlaylist, newMasterId){
    if (remoteSocket){
      remoteSocket.close();
      remoteSocket = null;
    }

    remotePlayer = newRemotePlayer;
    remotePlaylist = newRemotePlaylist;
    masterId = newMasterId;

    // 2. This code loads code
    let tag = document.createElement('script');
    tag.src = "/socket.io/socket.io.js";
    tag.onload = initSockets;

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function initFinished(){
    // player can only set current if playlist is already there
    // (race condition...)
    remotePlaylist.setRemote(RemoteControllerSocketIO);
    remotePlayer.setRemote(RemoteControllerSocketIO);
  }

  function initSockets(){

    remoteSocket = io("/remotes",{query: {masterId: masterId}});

    remoteSocket.on('connect', function(msg){
      
    });

    remoteSocket.on("videoChange", function(data, itemId){
      videoChange(data, itemId);
    });
    remoteSocket.on("stateChange", function(msg){
      stateChange(msg);
    });
    remoteSocket.on("timeChange", function(t, d){
      timeChange(t, d);
    });

    remoteSocket.on("cueVideo", function(itemId, data, position){
      cueVideo(itemId,data, position);
    });
    
    remoteSocket.on("removeVideo", function(itemId){
      removeVideo(itemId);
    });

    remoteSocket.on("moveVideo", function(itemId, newPosition){
      moveVideo(itemId, newPosition);
    });

    remoteSocket.on("newPlaylist", function(order, map){
      newPlaylist(order, map);
    })

    initFinished();
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

  function seekTo(time){
    remoteSocket.emit("seekTo", time);
  }


  function forwardClicked(){
    remoteSocket.emit("forwardClicked", "");
  }

  function backwardClicked(){
    remoteSocket.emit("backwardClicked", "");
  }

  function cueVideoRequest(data, position){
    remoteSocket.emit("cueVideoRequest", data, position);
  }

  function cueAfterCurrentRequest(data){
    remoteSocket.emit("cueAfterCurrentRequest", data);
  }

  function cueEndRequest(data){
    remoteSocket.emit("cueEndRequest", data);
  }

  function playVideoClicked(itemId){
    remoteSocket.emit("playVideoClicked", itemId);
  }

  function removeVideoClicked(itemId){
    remoteSocket.emit("removeVideoClicked", itemId);
  }

  function moveVideoPerformed(itemId, overItemId){
    remoteSocket.emit("moveVideoPerformed", itemId, overItemId);
  }

  function getPlayer(){
    remoteSocket.emit("getPlayer")
  }

  function getPlaylist(){
    remoteSocket.emit("getPlaylist")
  }
  
  function videoChange(data, itemId){
    remotePlayer.videoChange(data, itemId);
  }

  function stateChange(state){
    remotePlayer.stateChange(state);
  }

  function timeChange(time, duration){
    remotePlayer.timeChange(time, duration);
  }

  
  function cueVideo(itemId, data, position){
    remotePlaylist.cueVideo(itemId, data, position);
  }

  function removeVideo(itemId){
    remotePlaylist.removeVideo(itemId);
  }

  function moveVideo(itemId, newPosition){
    remotePlaylist.moveVideo(itemId, newPosition);
  }

  function newPlaylist(order, mapArray){
    let map = new Map();
    for (let i = 0; i<order.length; i++){
      map.set(order[i], mapArray[i]);
    }
    remotePlaylist.newPlaylist(order, map);
  }


  return {
    init:init,
    play,
    pause,
    seekTo,
    forwardClicked,
    backwardClicked,
    cueVideoRequest,
    cueAfterCurrentRequest,
    cueEndRequest,
    playVideoClicked,
    removeVideoClicked,
    moveVideoPerformed,
    getPlayer,
    getPlaylist
  };

}();