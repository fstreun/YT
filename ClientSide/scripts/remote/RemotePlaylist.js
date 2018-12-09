/*
Name: Fabio Streun
Date: 11/10/2018

Main Playlist controlls the current playlist running.

*/


"use strict";
let RemotePlaylist = function() {
  let remoteController = null;

  let dataMap = new Map();  // maps itemId to video data
  let domMap = new Map();   // maps itemId to dom element
  let itemIdCounter = 0;

  let playlistOrder = new Array();  // array of ordered itemIds
  let current = -1;

  let draggedID = null; // ID of the currently dragged playlist item.

  /**
   * Initializes the MainPlaylist.
   * @param {MainPlayer} newPlayer to be called on playlist item events.
   */
  function init(newPlayer){
    remoteController = newRemoteController;
  }

  function setRemoteController(newRemoteController){
    remoteController = newRemoteController;
  }

  /**
   * REQUEST!
   * Removes the item from the playlist.
   * @param {Number} itemId of the playlist item
   */
  function remove(itemId) {
    remoteController.removeFromPlaylist(itemId);
  }

  function removeConfirmed(itemId){
    let position = playlistOrder.indexOf(itemId);

    // remove from dom
    let item = domMap.get(itemId);
    item.parentNode.removeChild(item);

    playlistOrder.splice(position, 1);
    dataMap.delete(itemId);
    domMap.delete(itemId);
    if (position < current){
      current--;
    }
  }

  /**
   * REQUEST!
   * Moves a item to a new position in the playlist.
   * The item has to be already in the playlist.
   * @param {Number} itemId of the playlist item
   * @param {Number} newPosition in the playlist (>= 0 and < playlist length)
   */
  function move(itemId, newPosition){
    let position = playlistOrder.indexOf(itemId);
    if (!(position == newPosition)){
      remoteController.moveInPlaylist(itemId, newPosition);
    }
  }

  function moveConfirmed(itemId, newPosition){
    let position = playlistOrder.indexOf(itemId);
    if (!(position == newPosition)){

      playlistOrder.splice(position, 1);
      playlistOrder.splice(newPosition, 0, itemId);

      let dom = domMap.get(itemId);
      let after = domMap.get(playlistOrder[newPosition+1]);
      dom.parentNode.insertBefore(dom, after);
      
      if (position > current && newPosition <= current){
        current++;
      } else if (position <= current && newPosition > current){
        current --;
      }else if (position == current){
        current = newPosition;
      }
    }
  }

  function add(data, position){
    remoteController.addToPlaylist(data, position);
  }

  function addConfirmed(data, itemId, position){
    playlistOrder.splice(position, 0, itemId);
    dataMap.set(itemId, data);

    let dom = newListItem(itemId, data);
    domMap.set(itemId, dom);

    let list = qs("#player_playlist>.list");
    list.insertBefore(dom, domMap.get(playlistOrder[position+1]));
  }

  function setCurrent(position){
    current = position;
    setCurrentClass();
  }

  /**
   * REQUEST!
   * Adds new video to the end of the playlist.
   * @param {JSON} data of Video.
   */
  function cueEnd(data){
    add(data, playlistOrder.length);
  }

  /**
   * REQUEST!
   * Adds new video after the currently played video.
   * If no current exists (playlist not startet yet) then to the top.
   * @param {JSON} id of the Video
   * @returns {Number} itemId of the video
   */
  function cueAfterCurrent(data){
    add(data, current+1);

  }

  
  // PUBLIC FUNCTIONS
  return {
    init:init,
    setRemoteController:setRemoteController,
    cueAfterCurrent:cueAfterCurrent,
    cueEnd:cueEnd,
    move:move,

    addConfirmed:addConfirmed,
    moveConfirmed:moveConfirmed,
    removeConfirmed:removeConfirmed,
    setCurrent:setCurrent

  }


  /**
   * Creates a new DOM list element populated with the data of the video.
   * @param {Number} itemId of the item
   * @param {JSON} data of the video
   * @returns {DOM} item
   */
  function newListItem(itemId, data){
    // create list item
    let item = document.createElement("div");
    item.classList.add("list_item", "video", "mouse-pointer");
    item.draggable = true;

    let thumbnail = document.createElement("img");
    thumbnail.src = data.snippet.thumbnails.default.url;
    thumbnail.classList.add("thumbnail");
    item.appendChild(thumbnail);

    let info = document.createElement("div");
    info.classList.add("info");
    
    let title = document.createElement("div");
    title.classList.add(["title"]);
    title.innerText = data.snippet.title;
    info.appendChild(title);

    // time (duration)
    let time = document.createElement("time");
    time.dateTime = data.contentDetails.duration;
    let t = YTDataAPI.convertDurationFormat(data.contentDetails.duration);
    time.innerHTML = t.join(":");
    info.appendChild(time);

    item.appendChild(info);
    

    let right = document.createElement("div");
    right.classList.add("right", "item-hover");

    // remove
    let remove = document.createElement("span");
    remove.classList.add("option", "fas", "fa-times-circle");
    remove.addEventListener("click", function(event){
      event.stopPropagation();
      removeClicked(itemId);
    });
    right.appendChild(remove);


    item.appendChild(right);

    item.addEventListener("click", function(event){
      event.stopPropagation();
      itemClicked(itemId);
    });

    item.addEventListener("dragstart", function(e){
      itemDragStart(e, itemId);
    }, false);
    item.addEventListener("dragend", function(e){
      itemDragEnd(e, itemId);
    }, false);

    item.addEventListener("dragenter", function(e){
      itemDragEnter(e, itemId);
    }, false);
    item.addEventListener("dragover", function(e){
      itemDragOver(e, itemId);
    }, false);
    item.addEventListener("dragleave", function(e){
      itemDragLeave(e, itemId);
    }, false);
    item.addEventListener("drop", function(e){
      itemDrop(e, itemId);
    }, false);


    return item;
  }

  /**
   * Sets clicked item as next (set current to previous)
   * And calls player.forward() to play clicked item.
   * @param {Number} itemId which was clicked
   */
  function itemClicked(itemId){
    remoteController.playVideo(itemId);
  }

  /**
   * Removes the item from the play list.
   * @param {Number} itemId whose remove button was clicked.
   */
  function removeClicked(itemId){
    remove(itemId);
  }


  function itemDragStart(e, itemId){
    draggedID = itemId;
    e.target.classList.add("dragged");
    e.dataTransfer.setData('text', itemId);
  }
  function itemDragEnd(e, itemId){
    e.target.classList.remove("dragged");
    draggedID = null;
  }



  function itemDragEnter(e, itemId){
    //e.target.classList.add("dragged-over")

    if (!(draggedID == itemId)){
      let newPosition = playlistOrder.indexOf(itemId);
      move(draggedID, newPosition);
    }
  }

  function itemDragOver(e, itemId){
    event.preventDefault();
  }

  function itemDragLeave(e, itemId){
    //e.target.classList.remove("dragged-over");
  }

  function itemDrop(e, itemId){
    if (draggedID != null){
      e.preventDefault();

      let newPosition = playlistOrder.indexOf(itemId);
      move(draggedID, newPosition);
    }
  }






  function getListDOM(){
    return qs("#player_playlist>.list");
  }

  /**
   * Sets the class current to the correct dom list item
   */
  function setCurrentClass(){
    let old = qs("#player_playlist>.list>.list_item.current_video");
    if (old){
      old.classList.remove("current_video");
    }
    domMap.get(playlistOrder[current]).classList.add("current_video");
  }

  /**
   * Scrolls the view to the current video.
   */
  function scrollToCurrent(){
    domMap.get(playlistOrder[current]).scrollIntoView();
  }

}();


