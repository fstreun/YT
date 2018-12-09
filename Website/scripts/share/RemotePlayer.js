/*
Name: Fabio Streun
Date: 08/09/2018

*/

"use strict"

let RemotePlayer = function() {

    let remoteController = null;

    const TIMEBARMAX = 1000;

    let state = 0;
  
    let videoData = null;
    let duration = null;
  
    let timeInterval = null;


  /**
   */
  function init(newRemoteController){
    remoteController = newRemoteController;

    $("play_button").onclick = playButtonClicked;
    $("play_button_bwd").onclick = backward;
    $("play_button_fwd").onclick = forward;

    let playerTimeBar = $("player_timebar");
    $("player_timebar").onchange = timebarChanged;

    $("player_timebar").value = 0;
  }

  function setRemoteController(newRemoteController){
    remoteController = newRemoteController;
  }


  /**
   * Plays current loaded video
   */
  function play(){
    remoteController.play()
  }

  /**
   * Pauses current loaded video
   */
  function pause(){
    remoteController.pause();
  }

  /**
   * Loads next video in the Playlist
   */
  function forward(){
    remoteController.forward();
  }

  /**
   * Load previous video from the Playlist
   */
  function backward(){
    remoteController.backward();
  }

  function seekTo(time){
    remoteController.seekTo(time);
  }

  function dataChange(data){
    videoData = data;
    updateText();
  }

  function stateChange(newState){
    state = newState;
    updatePlayButton();
  }

  function timeChange(time, duration){
    updateTimebar(time, duration);
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


  function timebarChanged(element){
    let newTime = duration * (element.target.value / TIMEBARMAX);
    
    seekTo(newTime);
  }

  function updateText(){
    let title = videoData.snippet.title;
    document.title = title;
    qs("#player_info .title").innerText = title;
  }

  function updatePlayButton(){
    let btn = qs("#play_button")
    if (state == 0){
      // not playing
      btn.classList.remove("fa-pause");
      btn.classList.add("fa-play");

    }else if (state == 1){
      // playing
      btn.classList.remove("fa-play");
      btn.classList.add("fa-pause");

    }
  }

  function updateTimebar(currentTime, d){
    duration = d;
    $("player_timebar").value = ((currentTime/duration)*TIMEBARMAX);
  }

  return {
    init:init,
    play:play,
    pause:pause,
    forward:forward,
    backward:backward,
    dataChange:dataChange,
    stateChange:stateChange,
    timeChange:timeChange,
    setRemoteController:setRemoteController
  };

}();