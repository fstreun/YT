/*
Name: Fabio Streun
Date: 17/08/2018

*/



"use strict";
(function(){
window.addEventListener("load", function(){
    // 2. This code loads the IFrame Player API code asynchronously.
  let tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
);
})();

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
  let player = new YT.Player('player_video', {
    height: '200',
    width: '200',
    playerVars: {
      'controls': 0,
      'color': "white"
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': function(event){
        MainPlayer.stateChanged(event.data);
      }
    }
  });
  MainPlayer.init(player);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

}
