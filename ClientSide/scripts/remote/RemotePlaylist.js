

"use strict";
const RemotePlaylist = function () {
    let remote = null;

    function setRemote(newRemote) {
        remote = newRemote;
        playlistRequested = true;
        remote.getPlaylist();
    }

    const dataMap = new Map();  // maps itemId to video data

    const playlistOrder = new Array();  // array of ordered itemIds

    function forwardClicked() {
        if (remote){
          remote.forwardClicked();
        }
    }

    function backwardClicked() {
      if (remote){
        remote.backwardClicked();
      }
    }

    function cueVideoRequest(data, position) {
      if (remote){
        remote.cueAtVideoRequest(data, position);
      }
    }

    function cueAfterCurrentRequest(data) {
      if (remote){
        remote.cueAfterCurrentRequest(data);
      }
    }

    function cueEndRequest(data) {
      if (remote){
        remote.cueEndRequest(data);
      }
    }

    function playVideoClicked(itemId) {
      if (remote){
        remote.playVideoClicked(itemId);
      }
    }

    function removeVideoClicked(itemId) {
      if (remote){
        remote.removeVideoClicked(itemId);
      }
    }

    function moveVideoPerformed(itemId, overItemId) {
      if (itemId != overItemId) {
        if(remote){
          remote.moveVideoPerformed(itemId, overItemId);
        }
      }
    }

    //ACTIONS

    function cueVideo(itemId, data, position){

      playlistOrder.splice(position, 0, itemId);
      dataMap.set(itemId, data);

      const beforeId = playlistOrder[position + 1];

      PlayerController.addBefore(itemId, data, beforeId)
  }

  function removeVideo(itemId){
      PlayerController.removeVideo(itemId);

      const position = playlistOrder.indexOf(itemId);
      playlistOrder.splice(position, 1);
      dataMap.delete(itemId);
  }


  function moveVideo(itemId, newPosition){
      const oldPosition = playlistOrder.indexOf(itemId);

      playlistOrder.splice(oldPosition, 1);
      playlistOrder.splice(newPosition, 0, itemId);

      const after = playlistOrder[newPosition+1];

      PlayerController.moveVideoBefore(itemId, after)
  }

  let playlistRequested = false;

  function newPlaylist(order, map){
    if(playlistRequested){
      playlistRequested = false;
      for(let i=0; i<order.length; i++){
        let id = order[i];
        let data = map.get(id);
        cueVideo(id, data, i);
      }
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
        newPlaylist
    };
}();