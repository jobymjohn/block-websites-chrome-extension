// content.js

chrome.storage.sync.get({ blockedSites: [] }, function (result) {
  var blockedSites = result.blockedSites;
  var currentUrl = window.location.href.toLowerCase();

  // Check if the current URL matches any blacklisted site
  var isBlockedSite = blockedSites.some(function (entry) {
    return currentUrl.includes(entry.site) && isCurrentTimeWithinInterval(entry.from, entry.to);
  });

  if (isBlockedSite) {
    // Log a message before sending the message to ensure this part is reached
    console.log('Sending message to background to close the tab');
    // Send a message to close the tab
    chrome.runtime.sendMessage({ action: "closeTab" });
  }
});

// Function to check if the current time is within a specified interval
function isCurrentTimeWithinInterval(from, to) {
  var currentTime = new Date().getHours() * 60 + new Date().getMinutes();
  // Corrected comparison
  return currentTime >= from && currentTime < to;
}

// Listen for changes to the blocked sites and update the content script
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && "blockedSites" in changes) {
    var blockedSites = changes.blockedSites.newValue;
    var currentUrl = window.location.href.toLowerCase();

    // Check if the current URL matches any new blacklisted site
    var isBlockedSite = blockedSites.some(function (entry) {
      return currentUrl.includes(entry.site) && isCurrentTimeWithinInterval(entry.from, entry.to);
    });

    if (isBlockedSite) {
      // Log a message before sending the message to ensure this part is reached
      console.log('Sending message to background to close the tab');
      // Send a message to close the tab
      chrome.runtime.sendMessage({ action: "closeTab" });
    }
  }
});
