
"use strict";
const MasterPlayer = function() {
    let remote = null;
    let YTPlayer = null;

    function setYTPlayer(ytplayer){
        YTPlayer = ytplayer;
    }

    function setRemote(newRemote){
        remote = newRemote;
    }

    function play(){
        YTPlayer.playVideo();
    }

    function pause(){
        YTPlayer.pauseVideo();
    }

    function seekTo(newTime){
        YTPlayer.seekTo(newTime);
    }

    function loadVideo(data, itemId){
        player.loadVideoById(data.id, 0, "large");

        // because not listening for response
        // must call response itself
        PlayerController.dataChange(data);
        if (remote){
            remote.dataChange(itemId);
        }
    }

    return {
        setYTPlayer,
        setRemote,
        play,
        pause,
        seekTo,
        loadVideo,
    };

    // YTPlayer calls this!
    function stateChanged(playerStatus){
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

        PlayerController.stateChange(state);
        if(remote){
            remote.stateChange(state);
        }
    }

    function timeChanged(newTime, duration){

        PlayerController.timeChange(newTime, duration);
        if (remote){
            remote.timeChange(newTime, duration);
        }
    }
};