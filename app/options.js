"use strict";
console.log('options');

document.addEventListener('DOMContentLoaded', function() {
  var $bookmarkList = document.querySelector('#bookmark-list');

  chrome.runtime.getBackgroundPage(function (eventpage) {
    eventpage.getAllBookmarks(function(bookmarks) {
      console.log(bookmarks);
      var keys = Object.keys(bookmarks);
      keys.forEach(function(key) {
        var $bookmark = document.createElement('div');
        if (bookmarks[key].shortcut) {
          $bookmark.textContent = bookmarks[key].shortcut;
          bookmarks[key].bookmarks.forEach(function(node) {
            var $title = document.createElement('p');
            $title.textContent = node.title;
            $bookmark.appendChild($title);
          });
        } else {
          $bookmark.textContent = 'not set';
        }
        $bookmarkList.appendChild($bookmark);
      });
    });
  });
});

