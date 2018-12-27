

"use strict";
const PlayerController = function() {

    let player = null;
    let playlist = null;


    window.addEventListener("load", function () {
            $("play_button").onclick = playButtonClicked;
            $("play_button_bwd").onclick = backwardClicked;
            $("play_button_fwd").onclick = forwardClicked;
        
            let playerTimeBar = $("player_timebar");
            $("player_timebar").onchange = timebarChanged;
        
            $("player_timebar").value = 0;
    });


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

    function timebarChanged(){

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

    function loadVideo(data, itemId){
        if(player){
            player.loadVideo(data, itemId);
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
    function videoChange(data, itemId){
        updateText(data);
        setCurrent(itemId);
    }

    //########### PLAYLIST

    const domMap = new Map();   // maps itemId to dom element

    function forwardClicked(){
        playlist.forwardClicked();
    }

    function backwardClicked(){
        playlist.backwardClicked();
    }

    function cueAt(data, position){
        playlist.cueAt(data, position);
    }

    function cueAfterCurrent(data){
        playlist.cueAfterCurrent(data);
    }

    function cueEnd(data){
        playlist.cueEnd(data);
    }

    function playVideoClicked(itemId){
        playlist.playVideoClicked(itemId)
    }

    function removeVideoClicked(itemId){
        playlist.removeVideoClicked(itemId);
    }

    function moveVideoPerformed(itemId, newPosition){
        playlist.moveVideoPerformed(itemId, newPosition);
    }


    //######## responses

    function addAfter(itemId, data, referenceId){
        const dom = newPlaylistItem(itemId, data);
        domMap.set(itemId, dom);

        const list = qs("#player_playlist>.list");
        insertAfter(list, dom, domMap.get(referenceId))
    }

    function addBefore(itemId, data, referenceId){
        const dom = newPlaylistItem(itemId, data);
        domMap.set(itemId, dom);

        const list = qs("#player_playlist>.list");
        list.insertBefore(dom, domMap.get(referenceId))
    }

    function removeVideo(itemId){
        const dom = domMap.get(itemId);
        dom.parentNode.removeChild(dom);

        domMap.delete(itemId);
    }

    function moveVideoBefore(itemId, toItemId){
        if(itemId != toItemId){
            const dom = domMap.get(itemId);
            const to = domMap.get(toItemId);

            dom.parentNode.insertBefore(dom, to);
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
            MoveControl.itemDragOver(e, itemId);
            }, false);
        item.addEventListener("dragleave", function(e){
            MoveControl.itemDragLeave(e, itemId);
            }, false);
        item.addEventListener("drop", function(e){
            MoveControl.itemDrop(e, itemId);
            }, false);

        return item;
    }

    const MoveControl = function(){

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
            moveVideoPerformed(draggedID, itemId);
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
        
            moveVideoPerformed(draggedID, itemId);
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
        setBackEnd:setBackEnd,
        
        // requests
        play:play,
        pause:pause,
        seekTo:seekTo,
        loadVideo:loadVideo,

        // actions
        stateChange:stateChange,
        timeChange:timeChange,
        videoChange:videoChange,

        // requests
        forwardClicked:forwardClicked,
        backwardClicked:backwardClicked,
        cueAt:cueAt,
        cueAfterCurrent:cueAfterCurrent,
        cueEnd:cueEnd,
        playVideoClicked:playVideoClicked,
        removeVideoClicked:removeVideoClicked,
        moveVideoPerformed:moveVideoPerformed,

        // actions
        addAfter:addAfter,
        addBefore:addBefore,
        removeVideo:removeVideo,
        moveVideoBefore:moveVideoBefore

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
    
        }else if (state == 1){
          // playing
          btn.classList.remove("fa-play");
          btn.classList.add("fa-pause");
    
        }
    }

    function updateTimebar(currentTime, duration){
        $("player_timebar").value = ((currentTime/duration)*TIMEBARMAX);
    }    

    function setCurrent(itemId){

    }
    
      /**
       * Scrolls the view to the current video.
       */
    function scrollToCurrent(){
        domMap.get(playlistOrder[current]).scrollIntoView();
    }
    
}();

