

"use strict";
const MasterPlaylist = function () {
    let remote = null;

    function setRemote(newRemote) {
        remote = newRemote;
    }

    const dataMap = new Map();  // maps itemId to video data

    const playlistOrder = new Array();  // array of ordered itemIds
    let current = -1;

    let itemIdCounter = 0;

    function forwardClicked() {
        if (current < playlistOrder.length - 1) {
            current++;

            let itemId = playlistOrder[current];

            let data = dataMap.get(itemId);

            PlayerController.loadVideo(data, itemId)
        } else {
            // do nothing
        }
    }

    function backwardClicked() {
        if (current > 0) {
            current--;

            let itemId = playlistOrder[current];

            let data = dataMap.get(itemId);

            PlayerController.loadVideo(data, itemId)
        } else {
            // do nothing
        }
    }

    function cueAt(data, position) {
        const itemId = itemIdCounter++;

        playlistOrder.splice(position, 0, itemId);
        dataMap.set(itemId, data);

        const beforeId = playlistOrder[position + 1];

        PlayerController.addBefore(itemdId, data, beforeId)
        if (remote) {
            remote.addBefore(itemId, data, beforeId);
        }
    }

    function cueAfterCurrent(data) {
        const itemId = itemIdCounter++;
        const position = current + 1;

        const currentId = playlistOrder[current];


        playlistOrder.splice(position, 0, itemId);
        dataMap.set(itemId, data);

        PlayerController.addAfter(itemId, data, currentId); // returns undefined and not null
        if (remote) {
            remote.addAfter(itemId, data, currentId);
        }
    }

    function cueEnd(data) {
        const itemId = itemIdCounter++;

        playlistOrder.push(itemId);
        dataMap.set(itemId, data)

        PlayerController.addBefore(itemId, data, null);
        if (remote) {
            remote.addAfter(itemId, data, null);
        }
    }

    function playVideoClicked(itemId) {
        current = playlistOrder.indexOf(itemId);

        PlayerController.loadVideo(dataMap.get(itemId), itemId);
    }

    function removeVideoClicked(itemId) {
        PlayerController.removeVideo(itemId);
        if (remote) {
            remote.removeVideo(itemId);
        }

        const position = playlistOrder.indexOf(itemId);
        playlistOrder.splice(position, 1);
        dataMap.delete(itemId);
        if (position < current) {
            current--;
        }
    }

    function moveVideoPerformed(itemId, overItemId) {
        if (itemId != overItemId) {
            const oldPosition = playlistOrder.indexOf(itemId);
            const newPosition = playlistOrder.indexOf(overItemId);

            playlistOrder.splice(oldPosition, 1);
            playlistOrder.splice(newPosition, 0, itemId);

            if (oldPosition > current && newPosition <= current) {
                current++;
            } else if (oldPosition < current && newPosition > current) {
                current--;
            } else if (oldPosition == current) {
                current = newPosition;
            }

            const after = playlistOrder[newPosition+1];

            PlayerController.moveVideoBefore(itemId, after)
            if(remote){
                remote.moveVideoBefore(itemId, after);
            }
        }
    }


    return {
        setRemote,
        forwardClicked,
        backwardClicked,
        cueAt,
        cueAfterCurrent,
        cueEnd,
        playVideoClicked,
        removeVideoClicked,
        moveVideoPerformed
    };
}();