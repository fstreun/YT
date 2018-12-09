/*
Name: Fabio Streun
Date: 17/08/2018

*/



"use strict";
let YTBrowser = function() {

  let player = null;
  let playlist = null;

  /**
   * Initialze the listeners for the search field.
   * Should be called after the window is loaded (window.onload).
   */
  function init(){
    clear();
    $("search_btn").onclick = searchClicked;
    $("search_input").addEventListener("keyup", function(event){
      event.preventDefault();
      if(event.keyCode === 13){
        $("search_btn").click();
      }
    });
  }

  function setPlaylist(newPlaylist){
    playlist = newPlaylist;
  }

  function setPlayer(newPlayer){
    player = newPlayer;
  }

  function searchClicked(){
    let q = $("search_input").value;
    YTDataAPI.getSearch(q, appendSearchResult);

    clear();
    let searchResult = document.createElement("div");
    searchResult.classList.add("search-result", "list");
    $("browser").appendChild(searchResult);
    PlayerViewHandler.contractPlayer();
  }

  function playlistClicked(playlist){
    let playlistId = playlist.id.playlistId;
    YTDataAPI.getPlaylistItems(playlistId, appendPlaylistItems);

    clear();
    let browser = $("browser");
    browser.innerText = "Playlist: " + playlist.snippet.title;
    let playlistResult = document.createElement("div");
    playlistResult.classList.add("playlist-result", "list");
    $("browser").appendChild(playlistResult);
    PlayerViewHandler.contractPlayer();
  }

  function appendSearchResult(json){
    let fragment = document.createDocumentFragment();
    for (const index in json) {
      if (json.hasOwnProperty(index)) {
        const data = json[index];

        if (data.id.kind == "youtube#video"){
          fragment.appendChild(getVideoDOM(data));
        } else if (data.id.kind == "youtube#playlist"){
          fragment.appendChild(getPlaylistDOM(data));
        } else if (data.id.kind == "youtube#channel"){
          fragment.appendChild(getChannelDOM(data));
        } else {
          console.error("YTBrowser: Unknown search result type: " + data.id.kind);
        }
      }
    }
    qs("#browser .search-result").appendChild(fragment);
  }

  function appendPlaylistItems(json){
    let fragment = document.createDocumentFragment();
    for (const index in json) {
      if (json.hasOwnProperty(index)) {
        const data = json[index];

        if (data.id.kind == "youtube#video"){
          fragment.appendChild(getVideoDOM(data));
        } else {
          console.error("YTBrowser: Unknown search result type: " + data.id.kind);
        }
      }
    }
    qs("#browser .playlist-result").appendChild(fragment);
  }

  function getVideoDOM(data){
    let item = document.createElement("div");
    item.classList.add("list_item", "video", "mouse-pointer");

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

    // add front
    let addFront = document.createElement("span");
    addFront.classList.add("option", "fas", "fa-plus-circle");
    addFront.addEventListener("click", function(event){
      event.stopPropagation();
      playlist.cueAfterCurrent(data);
    });
    right.appendChild(addFront);

    // add back
    let addBack = document.createElement("span");
    addBack.classList.add("option", "fas", "fa-level-down-alt");
    addBack.addEventListener("click", function(event){
      event.stopPropagation();
      playlist.cueEnd(data);
    });
    right.appendChild(addBack);

    item.appendChild(right);

    item.addEventListener("click", function(event){
      event.stopPropagation();
      playlist.cueAfterCurrent(data);
      player.forward();
    });

    return item;
  }

  function getChannelDOM(data){
    let item = document.createElement("div");
    item.classList.add("list_item", "channel", "mouse-pointer");

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

    item.appendChild(info);

    item.addEventListener("click", function(event){
      event.stopPropagation();
    });

    return item;
  }

  function getPlaylistDOM(data){
    let item = document.createElement("div");
    item.classList.add("list_item", "playlist", "mouse-pointer");

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

    item.appendChild(info);

    item.addEventListener("click", function(event){
      event.stopPropagation();
      playlistClicked(data);
    });

    return item;
  }

  function clear(){
    let browser = $("browser");
    browser.innerHTML = "";
  }


  return {
    init:init,
    setPlayer:setPlayer,
    setPlaylist:setPlaylist
  }
}();