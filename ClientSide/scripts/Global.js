



"use strict";
(function(){

    window.addEventListener("load", function(){
    });

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

function insertAfter(newNode, referencedNode){
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}