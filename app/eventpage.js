console.log('hello');

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});
