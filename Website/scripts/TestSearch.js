

(function(){

  window.addEventListener("load", onLoad);

  function onLoad(event){
  }

  function searchClicked(){
    let id = $("search_input").value;
    YTDataAPI.getVideoData(id, function(data){
      MainPlaylist.cueEnd(data);
    });
  }

}());