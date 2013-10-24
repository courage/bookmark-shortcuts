"use strict";

console.log('hello');

chrome.commands.onCommand.addListener(function(command) {
  if (command == 'launch_options') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
    return;
  }

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

function getCommands(callback) {
  chrome.commands.getAll(function(commands) {
    callback(commands.filter(function(cmd) {
      return (cmd.name != 'launch_options');
    }));
  });
}

function commandToShortcut(commandName, callback) {
  getCommands(function(commands) {
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

window.getAllBookmarks = function(callback) {
  var commandToDescriptor = {}

  getCommands(function(commands) {
    var completionCount = 0;
    function completeOneCommand() {
      completionCount++;
      if (completionCount >= commands.length)
        callback(commandToDescriptor);
    }

    commands.forEach(function(command) {
      commandToDescriptor[command.name] = {};
      if (command.shortcut) {
        shortcutToBookmarkNodes(command.shortcut, function (nodes) {
          commandToDescriptor[command.name].shortcut = command.shortcut;
          commandToDescriptor[command.name].bookmarks = nodes;
          completeOneCommand();
        });
      } else {
        completeOneCommand();
      }
    });
  });
}