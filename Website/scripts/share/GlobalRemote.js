/*
Name: Fabio Streun
Date: 17/08/2018

Globally used functions like:
  $(id),
  qs(selector),
  qsa(selector)

Initialization of components, which have to be called on window onload.
*/




"use strict";
(function(){

  const REMOTESRC = "scripts/share/socket.io/RemoteControllerSocketIO.js";


  window.addEventListener("load", function(){

    YTBrowser.init();
    YTBrowser.setPlaylist(RemotePlaylist);
    YTBrowser.setPlayer(RemotePlayer);

    let tag = document.createElement('script');
    tag.src = REMOTESRC;
    tag.onload = function(){
      RemotePlayer.init();
      RemoteControllerSocketIO.init(RemotePlayer, RemotePlaylist);
      RemotePlayer.setRemoteController(RemoteControllerSocketIO);
      RemotePlaylist.setRemoteController(RemoteControllerSocketIO);
    }
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  }
  );

})();

  /**
   *  Shortcut to get the document element by id
   *  @param the string value of the ID of the DOM element you are getting
   *  @return the DOM element with that particular ID
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut to get the first document element by css selector
   * @param the string of the css selector
   * @return the first DOM element 
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
  /**
   * Shortcut to get a list of the document elements
   * by css selector
   * @param the string of the css selector
   * @return all DOM elements
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }