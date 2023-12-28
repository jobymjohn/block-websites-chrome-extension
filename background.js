// background.js

chrome.runtime.onInstalled.addListener(function () {
  console.log('Extension Installed');
});

chrome.runtime.onStartup.addListener(function () {
  console.log('Extension Started');
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Received message:', request);

  if (request.action === "closeTab") {
    // Close the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.remove(tabs[0].id, function () {
        console.log('Tab closed');
      });
    });
  }
});


chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  chrome.storage.sync.get({ blockedSites: [] }, function (result) {
    var blockedSites = result.blockedSites;
    var currentUrl = new URL(details.url).origin.toLowerCase();

    // Check if the current URL matches any blacklisted site
    var isBlockedSite = blockedSites.some(function (site) {
      return currentUrl.includes(site);
    });

    if (isBlockedSite) {
      // Send a message to close the tab
      chrome.runtime.sendMessage({ action: "closeTab" }, function (response) {
        console.log('Message response:', response);
      });
    }
  });
});
