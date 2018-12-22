

"use strict";
const MasterPlayer = function() {

    function forwardClicked(){
        playlist.forward();
    }

    function backwardClicked(){
        playlist.backward();
    }

    function cueAt(data, position){
        playlist.cueAt(data, position);
    }

    function cueAfterCurrent(data){
        playlist.cueAt(data, current+1);
    }

    function cueEnd(data){
        playlist.cueAt(data, playlistOrder.length);
    }

    function playVideoClicked(itemId){
        playlist.playVideo(itemId)
    }

    function removeVideoClicked(itemId){
        playlist.remove(itemId);
    }

    function movePerfomed(itemId, newPosition){
        playlist.move(itemId, newPosition);
    }


    return {
        forward,
        backward,
        cueAt,
        playVideo,
        remove,
        move
    };
};