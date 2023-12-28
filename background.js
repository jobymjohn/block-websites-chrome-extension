chrome.runtime.onInstalled.addListener(function () {
  console.log("Website Blocker extension installed");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "closeTab") {
    chrome.tabs.remove(sender.tab.id);
  }
});
