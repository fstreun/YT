/*
Name: Fabio Streun
Date: 09/09/2018

Main Playlist is a Playlist interface (e.g. used by YTBrowser).

It controls and is controlled by the player.

If a mainController (sends data to the server) it sends data
in the following cases:
changes to the playlist, current song changes
*/


"use strict";
let MainPlaylist = function() {
  let player = null;  // to be called on playlist item events.

  let dataMap = new Map();  // maps itemId to video data
  let domMap = new Map();   // maps itemId to dom element
  let itemIdCounter = 0;

  let playlistOrder = new Array();  // array of ordered itemIds
  let current = -1;

  let draggedID = null; // ID of the currently dragged playlist item.


  let mainController = null;

  /**
   * Initializes the MainPlaylist.
   * Sets the playlist of the player to this.
   * @param {MainPlayer} newPlayer to be called on playlist item events.
   */
  function init(newPlayer){
    player = newPlayer;
    player.setPlaylist(this);
  }

  function setMainController(newMainController){
    mainController = newMainController;
  }

  /**
   * Removes the item from the playlist.
   * @param {Number} itemId of the playlist item
   */
  function remove(itemId) {
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

    if (mainController){
      mainController.removeFromPlaylist(itemId);
    }
  }

  function removeRequest(itemId){
    remove(itemId);
  }

  /**
   * Moves a item to a new position in the playlist.
   * The item has to be already in the playlist.
   * @param {Number} itemId of the playlist item
   * @param {Number} newPosition in the playlist (>= 0 and < playlist length)
   */
  function move(itemId, newPosition){
    let position = playlistOrder.indexOf(itemId);
    if (!(position == newPosition)){
      playlistOrder.splice(position, 1);
      playlistOrder.splice(newPosition, 0, itemId);

      let dom = domMap.get(itemId);
      let after = domMap.get(playlistOrder[newPosition+1]);
      dom.parentNode.insertBefore(dom, after);
      
      if (position > current && newPosition <= current){
        current++;
      } else if (position < current && newPosition > current){
        current --;
      } else if (position == current){
        current = newPosition;
      }

      if (mainController){
        mainController.moveInPlaylist(itemId, newPosition);
      }
    }
  }

  function moveRequest(itemId, newPosition){
    move(itemId, newPosition);
  }

  function addRequest(data, position){
    let id = itemIdCounter++;
    let dom = newListItem(id, data);
    let list = qs("#player_playlist>.list");

    list.insertBefore(dom, domMap.get(playlistOrder[position]));

    playlistOrder.splice(position, 0, id);
    dataMap.set(id, data);
    domMap.set(id, dom);

    if (mainController){
      mainController.addToPlaylist(data, id, position);
    }

    return id;
  }

  /**
   * Adds new video to the end of the playlist.
   * @param {JSON} data of Video.
   * @returns {Number} new itemId of the video.
   */
  function cueEnd(data){
    let id = itemIdCounter++;
    let dom = newListItem(id, data);
    let list = qs("#player_playlist>.list");
    list.appendChild(dom);

    playlistOrder.push(id);
    dataMap.set(id, data);
    domMap.set(id, dom);

    if (mainController){
      mainController.addToPlaylist(data, id, playlistOrder.length-1);
    }

    return id;
  }

  /**
   * Adds new video after the currently played video.
   * If no current exists (playlist not startet yet) then to the top.
   * @param {JSON} id of the Video
   * @returns {Number} itemId of the video
   */
  function cueAfterCurrent(data){
    let id = itemIdCounter++;
    let dom = newListItem(id, data);
    let list = qs("#player_playlist>.list");

    list.insertBefore(dom, domMap.get(playlistOrder[current+1]));

    playlistOrder.splice(current+1, 0, id);
    dataMap.set(id, data);
    domMap.set(id, dom);

    if (mainController){
      mainController.addToPlaylist(data, id, current+1);
    }
    return id;
  }

  /**
   * Increases the current counter by one.
   * And scrolls to the currently playing video.
   * @returns {JSON} data of the new current video
   */
  function forward(){
    if (current < playlistOrder.length - 1){
      current++;
      setCurrentClass();

      scrollToCurrent();

      if (mainController){
        mainController.setCurrent(current);
      }

      return dataMap.get(playlistOrder[current]);
    }else{
      return null;
    }
  }

  /**
   * Decreases the current counter by one.
   * And scrolls to the currently playing video.
   * @returns {JSON} data of the new current video
   */
  function backward(){
    if (current > 0){
      current--;
      setCurrentClass();

      scrollToCurrent();

      if (mainController){
        mainController.setCurrent(current);
      }
      return dataMap.get(playlistOrder[current]);
    } else {
      return null;
    }
  }

  function playVideo(itemId){
    let position = playlistOrder.indexOf(itemId);
    current = position - 1;
    player.forward();
  }

  /**
   * @returns {JSON} data of the new current video
   */
  function getCurrentVideo(){
    return dataMap.get(playlistOrder[current]);
  }
  
  // PUBLIC FUNCTIONS
  return {
    init:init,
    setMainController:setMainController,
    cueAfterCurrent:cueAfterCurrent,
    cueEnd:cueEnd,
    move:move,
    forward:forward,
    backward:backward,
    playVideo:playVideo,
    getCurrentVideo:getCurrentVideo,

    addRequest:addRequest,
    removeRequest:removeRequest,
    moveRequest:moveRequest
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
    playVideo(itemId);
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


