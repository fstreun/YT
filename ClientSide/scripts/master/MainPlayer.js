/*
Name: Fabio Streun
Date: 17/08/2018

*/



"use strict";
let MainPlayer = function() {

  const TIMEBARMAX = 1000;

  let player = null;

  let state = 0;

  let videoData = null;

  let timeInterval = null;

  let mainController = null;
  
  /**
   * Initializes the MainPlayer module.
   * Assignes the player button listeners.
   * Should be called after the window loaded and the YouTube player is ready.
   * @param {YouTubePlayer} newPlayer to be controlled by the MainPlayer.
   */
  function init(newPlayer){
    player = newPlayer;
    $("play_button").onclick = playButtonClicked;
    $("play_button_bwd").onclick = backward;
    $("play_button_fwd").onclick = forward;

    let playerTimeBar = $("player_timebar");
    $("player_timebar").onchange = timebarChanged;

    $("player_timebar").value = 0;
  }

  function setMainController(newMainController){
    mainController = newMainController;
  }

  /**
   * Plays current loaded video
   */
  function play(){
    player.playVideo();
  }

  /**
   * Pauses current loaded video
   */
  function pause(){
    player.pauseVideo();
  }

  /**
   * Loads next video in the Playlist
   */
  function forward(){
    let data = MainPlaylist.forward();
    if (data != null){
      dataChange(data);
      loadById(data.id);
    }
  }

  /**
   * Load previous video from the Playlist
   */
  function backward(){
    let data = MainPlaylist.backward();
    if (data != null){
      dataChange(data);
      loadById(data.id);
    }
  }

  /**
   * seeks to the new time.
   * @param {Number} time to seek to
   */
  function seekTo(newTime){
    player.seekTo(newTime);
  }

  /**
   * Changes the state according to the new player status.
   * And updates the player buttons accordingly.
   * @param {Number} playerStatus of the player
   */
  function stateChanged(playerStatus){
    let newState = state;
    if (playerStatus == -1) {
      // unstarted
      newState = 0;
    } else if (playerStatus == 0) {
      // ended
      newState = 0;
      forward();
    } else if (playerStatus == 1) {
      // playing
      newState = 1;
    } else if (playerStatus == 2) {
      // paused
      newState = 0;
    } else if (playerStatus == 3) {
      // buffering
    } else if (playerStatus == 5) {
      // video cued
    }

    if (newState != state){
      stateChange(newState);
    }
  }

  /**
   * Loads new video into the player.
   * And updates the text.
   * @param {Number} id of the video to be loaded
   */
  function loadById(id){
    player.loadVideoById(id, 0, "large");
  }

  function playButtonClicked(){
    if (state == 0){
      // not playing
      play();
    }else if (state == 1){
      // playing
      pause();
    }
  }



  function dataChange(newData){
    videoData = newData;
    mainController.dataChange(newData);
    updateText(videoData);
  }

  function stateChange(newState){
    state = newState;
    mainController.stateChange(state);
    updatePlayButton(state);
  }

  function timeChange(time, duration){
    mainController.timeChange(time, duration);
    updateTimebar(time, duration);
  }



  function timebarChanged(element){
    let newTime = player.getDuration() * (element.target.value / TIMEBARMAX);
    seekTo(newTime);
  }

  function timebarFunction(){
    timeChange(player.getCurrentTime(), player.getDuration());
  }

  function updateText(videoData){
    if (videoData != null){
      let title = videoData.snippet.title;
      document.title = title;
      qs("#player_info .title").innerText = title;
    }
  }

  function updatePlayButton(state){
    let btn = qs("#play_button")
    if (state == 0){
      // not playing
      btn.classList.remove("fa-pause");
      btn.classList.add("fa-play");

      clearInterval(timeInterval);
    }else if (state == 1){
      // playing
      btn.classList.remove("fa-play");
      btn.classList.add("fa-pause");

      clearInterval(timeInterval);
      timeInterval = setInterval(timebarFunction, 500);
    }
  }

  function updateTimebar(currentTime, duration){
    $("player_timebar").value = ((currentTime/duration)*TIMEBARMAX);
  }

  return {
    init:init,
    play:play,
    pause:pause,
    forward:forward,
    backward:backward,
    seekTo:seekTo,
    stateChanged:stateChanged,
    setMainController:setMainController
  };

}();