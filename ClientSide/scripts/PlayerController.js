

"use strict";
const PlayerController = function() {

    let player = null;
    let playlist = null;



    function init(){
        $("play_button").onclick = playButtonClicked;
        $("play_button_bwd").onclick = backwardClicked;
        $("play_button_fwd").onclick = forwardClicked;
    
        let playerTimeBar = $("player_timebar");
        $("player_timebar").onchange = timebarChanged;
    
        $("player_timebar").value = 0;
    }

    function setBackEnd(newPlayer, newPlaylist){
        player = newPlayer;
        playlist = newPlaylist;
    }

    //########### player controls
    let state = 0;

    function playButtonClicked(){
        if (state == 0){
            // not playing
            play();
        }else if (state == 1){
            // playing
            pause();
        }
    }

    function play(){
        if(player){
            player.play();
        }
    }

    function pause(){
        if(player){
            player.pause();
        }
    }

    function seekTo(newTime){
        if(player){
            player.seekTo(newTime);
        }
    }


    // player should call this if state changed!
    function stateChange(newState){
        state = newState;
        updatePlayButton(newState);
    }


    // player should call this if time changed!
    function timeChange(newTime, duration){
        updateTimebar(newTime, duration);
    }

    // player should call this if data changes!
    function dataChange(itemId){
        let data = dataMap.get(itemId);
        updateText(data);
    }

    //########### PLAYLIST
    const dataMap = new Map();  // maps itemId to video data
    const domMap = new Map();   // maps itemId to dom element
  
    const playlistOrder = new Array();  // array of ordered itemIds
    let current = -1;


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


    //######## responses

    function forward(){
        const next = playlistOrder[current];
    }

    // playlist should call this
    function playVideo(itemId){
        current = playlistOrder.indexOf(itemId);
        setCurrentClass();
        player.loadVideo(dataMap.get(itemId), itemId)
    }

    // playlist should call this
    function addVideo(data, itemId, position){
        let dom = newPlaylistItem(itemId, data);
        let list = qs("#player_playlist>.list");

        list.insertBefore(dom, domMap.get(playlistOrder[position]));
    
        playlistOrder.splice(position, 0, id);
        dataMap.set(id, data);
        domMap.set(id, dom);
    }

    // playlist should call this
    function removeVideo(itemId){
        // remove from dom
        let item = domMap.get(itemId);
        item.parentNode.removeChild(item);
    
        let position = playlistOrder.indexOf(itemId);
        playlistOrder.splice(position, 1);
        dataMap.delete(itemId);
        domMap.delete(itemId);
        if (position < current){
          current--;
        }
    }

    /** Playlist should call this
     * Moves a tiem to a new position in the playlist.
     * The item has to be already in the playlist.
     * @param {Number} itemId of the item to be moved
     * @param {Number} newPosition of the item
     */
    function moveVideo(itemId, newPosition){
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
        }
    }
    
    


    function newPlaylistItem(itemId, data){
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
            removeVideoClicked(itemId);
        });
        right.appendChild(remove);


        item.appendChild(right);

        item.addEventListener("click", function(event){
            event.stopPropagation();
            playVideoClicked(itemId);
        });

        item.addEventListener("dragstart", function(e){
            MoveControl.itemDragStart(e, itemId);
            }, false);
        item.addEventListener("dragend", function(e){
            MoveControl.itemDragEnd(e, itemId);
            }, false);
        item.addEventListener("dragenter", function(e){
            MoveControl.itemDragEnter(e, itemId);
            }, false);
        item.addEventListener("dragover", function(e){
            itemDragOver(e, itemId);
            }, false);
        item.addEventListener("dragleave", function(e){
            MoveControl.itemDragLeave(e, itemId);
            }, false);
        item.addEventListener("drop", function(e){
            MoveControl.itemDrop(e, itemId);
            }, false);

        return item;
    }

    let MoveControl = function(){

        let draggedID = null;

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
            movePerfomed(draggedID, newPosition);
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
            movePerfomed(draggedID, newPosition);
            }
        }

        return {
            itemDragStart,
            itemDragEnd,
            itemDragEnter,
            itemDragLeave,
            itemDragOver,
            itemDrop
        }
    }();



    return {
        init:init,
        setBackEnd:setBackEnd,
        
        // requests
        play:play,
        pause:pause,
        seekTo:seekTo,

        // actions
        stateChange:stateChange,
        timeChange:timeChange,
        dataChange:dataChange,

        // requests
        forwardClicked:forwardClicked,
        backwardClicked:backwardClicked,
        cueAt:cueAt,
        cueAfterCurrent:cueAfterCurrent,
        cueEnd:cueEnd,
        removeVideoClicked:removeVideoClicked,
        movePerfomed:movePerfomed,

        // actions
        playVideo:playVideo,
        addVideo:addVideo,
        removeVideo:removeVideo,
        moveVideo:moveVideo

    };


    function updateText(videoData){
        if (videoData != null){
          let title = videoData.snippet.title;
          document.title = title;
          qs("#player_info .title").innerText = title;
        }
    }

    function updatePlayButton(state){
        let btn = qs("#play_button")
        if (state == 0){
          // not playing
          btn.classList.remove("fa-pause");
          btn.classList.add("fa-play");
    
          clearInterval(timeInterval);
        }else if (state == 1){
          // playing
          btn.classList.remove("fa-play");
          btn.classList.add("fa-pause");
    
          clearInterval(timeInterval);
          timeInterval = setInterval(timebarFunction, 500);
        }
    }

    function updateTimebar(currentTime, duration){
        $("player_timebar").value = ((currentTime/duration)*TIMEBARMAX);
    }    

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

