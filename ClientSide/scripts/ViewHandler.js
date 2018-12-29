/*
  Author: Streun Fabio
  Date: 09.09.2018

  
 */

let PlayerViewHandler = function(){

  window.addEventListener("load", onLoad);

  function onLoad(event){
    $("player_expand").onclick = expandPlayerClicked;
    $("share_bar_btn").onclick = expandShareClicked;
  }

  function expandPlayerClicked(){
    qs("main").classList.toggle("player_expanded");
  }

  function expandPlayer(){
    qs("main").classList.add("player_expanded");
  }

  function contractPlayer(){
    qs("main").classList.remove("player_expanded");
  }

  function expandShareClicked(){
    $("share_bar").classList.toggle("expanded");
  }


  return {
    expandPlayer:expandPlayer,
    contractPlayer: contractPlayer
  }

}();