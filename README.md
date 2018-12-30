# YT
An web application which main goal is to control a YouTube player running inside the website from other devices over the internet.

Therefore an master page exists, on which the video is played, and remote pages, which only see the control pannel.
Both have an simplified YouTube search available to look for videos and add them to the running playlist.

Communication between the master and its remotes runs over socket.io.

A running example can be found here:
http://fstreun.vsos.ethz.ch:3000/

Click the share button (top right) and choose an ID for your master. Then click ok and the address for the remotes is displayed.

