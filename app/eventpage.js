"use strict";

console.log('hello');

chrome.commands.onCommand.addListener(function(command) {
  commandToShortcut(command, function(shortcut) {
    console.log('Command:', command, shortcut);
    if (shortcut) {
      shortcutToBookmarkNodes(shortcut, createTabsForBookmarkNodes);
    }
  });
});

chrome.commands.getAll(function(commands) {
  commands.forEach(function(command) {
    console.log(command.name, command.shortcut);
  });
});

function commandToShortcut(commandName, callback) {
  chrome.commands.getAll(function(commands) {
    var notFound = commands.every(function(command) {
      if (command.name === commandName) {
        callback(command.shortcut);
        return false;
      } else {
        return true;
      }
    });

    if (notFound)
      callback();
  });
}

function shortcutToBookmarkNodes(shortcut, callback) {
  var bracketName = '[' + shortcut + ']';
  chrome.bookmarks.search(bracketName, callback);
}

function createTabsForBookmarkNodes(nodes) {
  nodes.forEach(function(node) {
    if (node.url)
      chrome.tabs.create({ url: node.url });
    else if (node.children)
      createTabsForBookmarkNodes(node.children);
  });
}
