"use strict";
console.log('options');

document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.getBackgroundPage(function (eventpage) {
    eventpage.getAllBookmarks(function(bookmarks) {
      console.log(bookmarks);
    });
  });
});

