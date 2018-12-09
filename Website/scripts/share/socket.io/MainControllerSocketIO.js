/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

let MainControllerSocketIO = function() {

  const HOST = "http://localhost:3000";

  let masterSocket = null;

  let mainPlayer = null;
  let mainPlaylist = null;

  function init(newMainPlayer, newMainPlaylist){
    mainPlayer = newMainPlayer;
    mainPlaylist = newMainPlaylist;

    // 2. This code loads code
    let tag = document.createElement('script');
    tag.src = "http://localhost:3000/socket.io/socket.io.js";
    tag.onload = initSockets;

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function initSockets(){
    masterSocket = io(HOST + "/masters");

    masterSocket.on("play", function(msg){
      play();
    });
    masterSocket.on("pause", function(msg){
      pause();
    });
    masterSocket.on("forward", function(msg){
      forward();
    });
    masterSocket.on("backward", function(msg){
      backward();
    });
    masterSocket.on("seekTo", function(msg){
      seekTo(msg);
    });
    masterSocket.on("playVideo", function(msg){
      playVideo(msg);
    });


    masterSocket.on("addToPlaylist", function(data, position){
      addRequest(data, position);
    });
    
    masterSocket.on("removeFromPlaylist", function(itemId){
      removeRequest(itemId);
    });

    masterSocket.on("moveInPlaylist", function(itemId, newPosition){
      moveRequest(itemId, newPosition);
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

  /**
   * Loads next video in the Playlist
   */
  function forward(){
    mainPlayer.forward();
  }

  /**
   * Load previous video from the Playlist
   */
  function backward(){
    mainPlayer.backward();
  }

  function seekTo(time){
    mainPlayer.seekTo(time);
  }

  
  function playVideo(itemId){
    mainPlaylist.playVideo(itemId);
  }

  function addRequest(data, position){
    mainPlaylist.addRequest(data, position);
  }

  function moveRequest(itemId, newPosition){
    mainPlaylist.moveRequest(itemId, newPosition);
  }

  function removeRequest(itemId){
    mainPlaylist.removeRequest(itemId);
  }


  function dataChange(data){
    masterSocket.emit("dataChange", data);
  }

  function stateChange(state){
    masterSocket.emit("stateChange", state);
  }

  function timeChange(time, duration){
    masterSocket.emit("timeChange", time, duration);
  }




  function addToPlaylist(data, itemId, position){
    masterSocket.emit("addToPlaylist", data, itemId, position);
  }

  function removeFromPlaylist(itemId){
    masterSocket.emit("removeFromPlaylist", itemId);
  }

  function moveInPlaylist(itemId, newPosition){
    masterSocket.emit("moveInPlaylist", itemId, newPosition);
  }

  function setCurrent(position){
    masterSocket.emit("setCurrent", position);
  }


  return {
    init:init,
    dataChange:dataChange,
    stateChange:stateChange,
    timeChange:timeChange,
    addToPlaylist:addToPlaylist,
    removeFromPlaylist:removeFromPlaylist,
    moveInPlaylist:moveInPlaylist,
    setCurrent:setCurrent
  };

}();