/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

const RemotePlayer = function () {

  let remote = null;

  function setRemote(newRemote) {
    remote = newRemote;
    remote.getPlayer();
  }

  function play() {
    if (remote) {
      remote.play()
    }
  }

  function pause() {
    if (remote) {
      remote.pause();
    }
  }

  function seekTo(newTime) {
    if (remote) {
      remote.seekTo(newTime);
    }
  }

  function loadVideo(data, itemId) {
    if (remote) {
      remote.videoChange(data, itemId);
    }
  }

  return {
    setRemote,
    play,
    pause,
    seekTo,
    loadVideo,

    stateChange,
    timeChange,
    videoChange
  };

  function stateChange(playerStatus) {
    let state = 0;
    if (playerStatus == -1) {
      // unstarted
      state = 0;
    } else if (playerStatus == 0) {
      // ended
      state = 0;
    } else if (playerStatus == 1) {
      // playing
      state = 1;
    } else if (playerStatus == 2) {
      // paused
      state = 0;
    } else if (playerStatus == 3) {
      // buffering
      return;
    } else if (playerStatus == 5) {
      // video cued
      return;
    }

    PlayerController.stateChange(state);
  }

  function timeChange(newTime, duration) {

    PlayerController.timeChange(newTime, duration);
  }

  function videoChange(data, itemId) {
    PlayerController.videoChange(data, itemId);
  }

}();