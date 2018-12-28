/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

let MainControllerSocketIO = function() {

  const HOST = "http://localhost:3000";

  let masterSocket = null;
  let masterId = null;

  let mainPlayer = null;
  let mainPlaylist = null;

  function init(newMainPlayer, newMainPlaylist, newMasterId){
    mainPlayer = newMainPlayer;
    mainPlaylist = newMainPlaylist;
    masterId = newMasterId;

    // 2. This code loads code
    let tag = document.createElement('script');
    tag.src = "http://localhost:3000/socket.io/socket.io.js";
    tag.onload = initSockets;

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function initSockets(){
    mainPlayer.setRemote(MainControllerSocketIO);
    mainPlaylist.setRemote(MainControllerSocketIO);

    masterSocket = io(HOST + "/masters");

    masterSocket.on("connect", function(msg){
      masterSocket.emit("masterId", masterId);
    });

    masterSocket.on("play", function(msg){
      play();
    });
    masterSocket.on("pause", function(msg){
      pause();
    });
    masterSocket.on("seekTo", function(msg){
      seekTo(msg);
    });

    masterSocket.on("forwardClicked", function(msg){
      forwardClicked();
    });
    masterSocket.on("backwardClicked", function(msg){
      backwardClicked();
    });
    masterSocket.on("cueVideoRequest", function(data, position){
      cueVideoRequest(data, position);
    });

    masterSocket.on("cueAfterCurrentRequest", function(data){
      cueAfterCurrentRequest(data);
    });

    masterSocket.on("cueEndRequest", function(data){
      cueEndRequest(data);
    });

    masterSocket.on("playVideoClicked", function(itemId){
      playVideoClicked(itemId);
    });
    
    masterSocket.on("removeVideoClicked", function(itemId){
      removeVideoClicked(itemId);
    });

    masterSocket.on("moveVideoPerformed", function(itemId, overItemId){
      moveVideoPerformed(itemId, overItemId);
    });

    masterSocket.on("getPlayer", function(itemId, overItemId){
      getPlayer(itemId, overItemId);
    });

    masterSocket.on("getPlaylist", function(itemId, overItemId){
      getPlaylist(itemId, overItemId);
    });
  }

  /**
   * Plays current loaded video
   */
  function play(){
    mainPlayer.play();
  }

  /**
   * Pauses current loaded video
   */
  function pause(){
    mainPlayer.pause();
  }

  function seekTo(time){
    mainPlayer.seekTo(time);
  }

  function forwardClicked(){
    mainPlaylist.forwardClicked();
  }

  function backwardClicked(){
    mainPlaylist.backwardClicked();
  }

  function cueVideoRequest(data, position){
    mainPlaylist.cueVideoRequest(data, position);
  }

  function cueAfterCurrentRequest(data, position){
    mainPlaylist.cueAfterCurrentRequest(data, position);
  }

  function cueEndRequest(data, position){
    mainPlaylist.cueEndRequest(data, position);
  }

  function playVideoClicked(itemId){
    mainPlaylist.playVideoClicked(itemId);
  }

  function moveVideoPerformed(itemId, overItemId){
    mainPlaylist.moveVideoPerformed(itemId, overItemId);
  }

  function removeVideoClicked(itemId){
    mainPlaylist.removeVideoClicked(itemId);
  }

  function getPlayer(){
    mainPlayer.getPlayer();
  }

  function getPlaylist(){
    mainPlaylist.getPlaylist();
  }


  function videoChange(data){
    masterSocket.emit("videoChange", data);
  }

  function stateChange(state){
    masterSocket.emit("stateChange", state);
  }

  function timeChange(time, duration){
    masterSocket.emit("timeChange", time, duration);
  }




  function cueVideo(itemId, data, position){
    masterSocket.emit("cueVideo", itemId, data, position);
  }

  function removeVideo(itemId){
    masterSocket.emit("removeVideo", itemId);
  }

  function moveVideo(itemId, newPosition){
    masterSocket.emit("moveVideo", itemId, newPosition);
  }

  function newPlaylist(order, map){
    let mapArray = new Array();
    for (let i = 0; i<order.length; i++){
      mapArray.push(map.get(order[i]));
    }
    masterSocket.emit("newPlaylist", order, mapArray);
  }


  return {
    init:init,
    videoChange,
    stateChange,
    timeChange,
    cueVideo,
    removeVideo,
    moveVideo,
    newPlaylist
  };

}();