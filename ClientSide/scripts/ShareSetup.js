
"use strict";
const ShareSetup = function() {

    window.addEventListener("load", function () {
        $("share_btn").addEventListener("click", shareBtnClicked);
    });

    function shareBtnClicked(){
        let id = $("playerID_input").value;
        MasterControllerSocketIO.init(MasterPlayer, MasterPlaylist, id);
        let remoteURL = location.hostname;
        let remotePort = location.port;
        if (remotePort != "80"){
            remoteURL += ":" + remotePort;
        }
        remoteURL += "/" + id;
        $("remote_link").innerText = remoteURL;
        $("remote_link").href = "/" + id;
    }

}();