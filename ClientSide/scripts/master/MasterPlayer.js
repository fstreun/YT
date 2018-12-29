
"use strict";
const MasterPlayer = function () {
    let remote = null;
    let YTPlayer = null;

    let currentState = 0;
    let currentData = null;
    let currentItemId = null;
    let currentTime = 0;

    let timeInterval = null;
    const TIMEINTERVAL = 1000;

    function setYTPlayer(ytplayer) {
        YTPlayer = ytplayer;
        console.log("YouTube player binded to MasterPlayer")
    }

    function setRemote(newRemote) {
        remote = newRemote;
    }

    function play() {
        YTPlayer.playVideo();
    }

    function pause() {
        YTPlayer.pauseVideo();
    }

    function seekTo(newTime) {
        YTPlayer.seekTo(newTime);
    }

    function loadVideo(data, itemId) {
        YTPlayer.loadVideoById(data.id, 0, "large");

        // because not listening for response
        // must call response itself
        videoChange(data, itemId);
    }

    return {
        setYTPlayer,
        setRemote,
        play,
        pause,
        seekTo,
        loadVideo,

        stateChange,
        timeChange,
        videoChange,
        getPlayer
    };

    // YTPlayer calls this!
    function stateChange(playerStatus) {
        let state = 0;
        if (playerStatus == -1) {
            // unstarted
            state = 0;
        } else if (playerStatus == 0) {
            // ended
            state = 0;
            PlayerController.forwardClicked();
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

        if(currentState != state){
            currentState = state;
            PlayerController.stateChange(state);
            if (remote) {
                remote.stateChange(state);
            }

            if(currentState == 0){
                stopTimeInterval();
            }else{
                startTimeInterval();
            }
        }
    }

    function timeChange(newTime, duration) {
        currentTime = newTime;
        PlayerController.timeChange(newTime, duration);
        if (remote) {
            remote.timeChange(newTime, duration);
        }
    }

    function videoChange(data, itemId){
        currentData = data;
        currentItemId = itemId;

        PlayerController.videoChange(data, itemId);
        if (remote) {
            remote.videoChange(data, itemId);
        }
    }

    function getPlayer(){
        if(remote){
            remote.stateChange(currentState);
            remote.timeChange(currentTime);
            remote.videoChange(currentData, currentItemId);
        }
    }

    function startTimeInterval(){
        if(timeInterval){
            // already running
        }else{
            timeInterval = setInterval(function(){
                timeChange(YTPlayer.getCurrentTime(), YTPlayer.getDuration());
            }, TIMEINTERVAL);
        }
    }

    function stopTimeInterval(){
        if(timeInterval){
            clearInterval(timeInterval);
            timeInterval = null;
        }else{
            // already stopped
        }
    }
}();


(function () {
    window.addEventListener("load", function () {
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
            'onStateChange': function (event) {
                MasterPlayer.stateChange(event.data);
            }
        }
    });
    MasterPlayer.setYTPlayer(player);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

}
