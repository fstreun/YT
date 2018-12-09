/*
  Author: Streun Fabio
  Date: 09.09.2018

  
 */

let PlayerViewHandler = function(){

  window.addEventListener("load", onLoad);

  function onLoad(event){
    $("player_expand").onclick = expandClicked;
  }

  function expandClicked(){
    qs("main").classList.toggle("player_expanded");
  }

  function expandPlayer(){
    qs("main").classList.add("player_expanded");
  }

  function contractPlayer(){
    qs("main").classList.remove("player_expanded");
  }

  return {
    expandPlayer:expandPlayer,
    contractPlayer: contractPlayer
  }

}();