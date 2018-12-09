/*
Name: Fabio Streun
Date: 17/08/2018

*/


"use strict";
let YTDataAPI = function() {

  const URL = "https://www.googleapis.com";

  const APIKEY = "AIzaSyCbtbiApIKirMTMq8TOO33T2qpdDj0EOm0";

  const PATH_SEARCH = "/youtube/v3/search";
  const PATH_VIDEOS = "/youtube/v3/videos";
  const PATH_CHANNELS = "/youtube/v3/channels";
  const PATH_PLAYLISTS = "/youtube/v3/playlistItems";

  /**
   * Fetches the data of a video.
   * @param {String} id of video
   * @param {function(JSON)} callback to get called with the result
   */
  function getVideoData(id, callback){
    //TODO secure??
    let url = URL + PATH_VIDEOS + "?part=snippet,contentDetails&id=" + id + "&key=" + APIKEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(function(json){
        return json.items["0"];
      })
      .then(callback)
      .catch(catchError);
      
  }

  /**
   * Fetches the data of videos (at max 50)
   * @param {String[]} ids of videos
   * @param {function(JSON)} callback to get called with the result
   */
  function getVideosData(ids, callback){
    //TODO secure??
    let url = URL + PATH_VIDEOS + "?part=snippet,contentDetails&id=" + ids.join() + "&key=" + APIKEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(function(json){
        return json.items;
      })
      .then(callback)
      .catch(catchError);
  }

  /**
   * Fetches the data of a search query
   * @param {String} query to use
   * @param {function(JSON)} callback to be called with the result
   * @param {String} type of the wanted results (options: video, channel, playlist)
   */
  function getSearch(query, callback, type="video,channel,playlist"){
    let url = URL + PATH_SEARCH + "?part=snippet&type=" + type + "&maxResults=50&q=" + query  + "&key=" + APIKEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(function(json){

        // get all video id and the index of the video in the search result
        let ids = new Array();
        let videoIndex = new Array();
        let index = 0;
        json.items.forEach(item => {
          if (item.id.kind == "youtube#video"){
            ids.push(item.id.videoId)
            videoIndex.push(index);
          }
          index++;
        });

        getVideosData(ids, function(videosData){
          let i = 0;
          videosData.forEach(data => {
            json.items[videoIndex[i]].contentDetails = data.contentDetails;
            i++;
          });
          callback(json.items);
        });
      })
      .catch(catchError);
  }

  /**
   * Fetches data from playlist items
   * @param {String} playlistId of the playlist
   * @param {function(JSON)} callback to be called with the result
   */
  function getPlaylistItems(playlistId, callback){
    let url = URL + PATH_PLAYLISTS + "?part=snippet&maxResults=50&playlistId=" + playlistId  + "&key=" + APIKEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(function(json) {

        let ids = new Array();
        json.items.forEach(item => {
          ids.push(item.snippet.resourceId.videoId)
        });
        getVideosData(ids, function(videosData){
          let i = 0;
          videosData.forEach(data => {
            json.items[i].id = json.items[i].snippet.resourceId;
            json.items[i].contentDetails = data.contentDetails;
            i++;
          });
          callback(json.items);
        });
      })
      .catch(catchError);
  }

  function getRelatedVideo(id, callback){
    // TODO test this method
    let url = URL + PATH_SEARCH + "?part=snipped&type=video&maxResults=1&relatedToVideoId=" + id + "&key=" + APIKEY;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(function(json){
        return json.items["0"];
      })
      .then(callback)
      .catch(catchError);
  }

  /**
   * Converts the youtube PT format to a more useful format
   * @param {String} duration in youtube PT format
   * @returns {String, String, String} hour, minutes, seconds
   */
  function convertDurationFormat(duration){
    const rx = /\d+H|\d+M|\d+S/g;
    const index = {'H': 0, 'M': 1, 'S': 2};
    let match = duration.match(rx);
    
    let result = ["0", "0", "0"];


    match.forEach(m => {
      result[index[m.slice(-1)]] = m.slice(0, -1);
    });

    return result;
  }

    /**
    * Function to check the status of an Ajax call, boiler plate code to include,
    * based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    * @param the response text from the url call
    * @return did we succeed or not, so we know whether or not to continue with the handling of
    * this promise
    */
   function checkStatus(response) {
     console.log("YTDataAPI: check Status");
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status +
                                       ": " + response.statusText));
    }
  }

 function catchError(error) {
   //error: do something with error
 }
 
  return {
    getSearch:getSearch,
    getVideoData:getVideoData,
    getRelatedVideo:getRelatedVideo,
    getPlaylistItems:getPlaylistItems,
    convertDurationFormat:convertDurationFormat
  };





  /* GOOGLE API CLIENT LIBRARY

  window.addEventListener("load", function(){

    // This code loads the Google API Client Library.
    gapi.load('client', function(){
      gapi.client.init({
        'apiKey': APIKEY
      }).then(function(){
        console.log("Google  API Client Library loaded");
      })
    }, function(reason){
      console.log("Error: " + reason.result.error.message);
    });

  });

  function removeEmptyParams(params) {
    for (var p in params) {
      if (!params[p] || params[p] == 'undefined') {
        delete params[p];
      }
    }
    return params;
  }

  function executeRequest(request, callback){
    request.execute(callback);
  }

  function buildApiRequest(requestMethod, path, params) {
    params = removeEmptyParams(params);
    let request = gapi.client.request({
        'method': requestMethod,
        'path': path,
        'params': params
    });
    return request;
  }

  */

}();