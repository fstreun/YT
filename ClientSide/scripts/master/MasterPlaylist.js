

"use strict";
const MasterPlaylist = function () {
    let remote = null;

    function setRemote(newRemote) {
        remote = newRemote;
    }

    const dataMap = new Map();  // maps itemId to video data

    const playlistOrder = new Array();  // array of ordered itemIds
    let current = -1;

    let itemIdCounter = 0;


    function forwardClicked() {
        if (current < playlistOrder.length - 1) {
            current++;

            let itemId = playlistOrder[current];

            let data = dataMap.get(itemId);

            PlayerController.loadVideo(data, itemId)
        } else {
            // do nothing
        }
    }

    function backwardClicked() {
        if (current > 0) {
            current--;

            let itemId = playlistOrder[current];

            let data = dataMap.get(itemId);

            PlayerController.loadVideo(data, itemId)
        } else {
            // do nothing
        }
    }

    function cueVideoRequest(data, position) {
        const itemId = itemIdCounter++;
        cueVideo(itemId, data, position);
    }

    function cueAfterCurrentRequest(data) {
        const position = current + 1;
        cueVideoRequest(data, position);
    }

    function cueEndRequest(data) {
        const position = playlistOrder.length;
        cueVideoRequest(data, position);
    }

    function playVideoClicked(itemId) {
        current = playlistOrder.indexOf(itemId);

        PlayerController.loadVideo(dataMap.get(itemId), itemId);
    }

    function removeVideoClicked(itemId) {
        removeVideo(itemId)
    }

    function moveVideoPerformed(itemId, overItemId) {
        if (itemId != overItemId) {
            const newPosition = playlistOrder.indexOf(overItemId);
            moveVideo(itemId, newPosition);
        }
    }

    // ACTIONS

    function cueVideo(itemId, data, position){

        playlistOrder.splice(position, 0, itemId);
        dataMap.set(itemId, data);

        const beforeId = playlistOrder[position + 1];

        PlayerController.addBefore(itemId, data, beforeId)
        if (remote) {
            remote.cueVideo(itemId, data, position);
        }
    }

    function removeVideo(itemId){
        PlayerController.removeVideo(itemId);
        if (remote) {
            remote.removeVideo(itemId);
        }

        const position = playlistOrder.indexOf(itemId);
        playlistOrder.splice(position, 1);
        dataMap.delete(itemId);
        if (position < current) {
            current--;
        }
    }


    function moveVideo(itemId, newPosition){
        const oldPosition = playlistOrder.indexOf(itemId);

        playlistOrder.splice(oldPosition, 1);
        playlistOrder.splice(newPosition, 0, itemId);

        if (oldPosition > current && newPosition <= current) {
            current++;
        } else if (oldPosition < current && newPosition > current) {
            current--;
        } else if (oldPosition == current) {
            current = newPosition;
        }

        const after = playlistOrder[newPosition+1];

        PlayerController.moveVideoBefore(itemId, after)
        if(remote){
            remote.moveVideo(itemId, newPosition);
        }
    }

    function getPlaylist(){
        if(remote){
            remote.newPlaylist(playlistOrder, dataMap);
        }
    }


    return {
        setRemote,
        forwardClicked,
        backwardClicked,
        cueVideoRequest,
        cueAfterCurrentRequest,
        cueEndRequest,
        playVideoClicked,
        removeVideoClicked,
        moveVideoPerformed,
        cueVideo,
        removeVideo,
        moveVideo,
        getPlaylist
    };
}();