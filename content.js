chrome.storage.sync.get({ blockedSites: [] }, function (result) {
  var blockedSites = result.blockedSites;
  var currentUrl = window.location.href.toLowerCase();

  // Check if the current URL matches any blacklisted site
  if (blockedSites.some(site => currentUrl.includes(site))) {
    // Send a message to close the tab
    chrome.runtime.sendMessage({ action: "closeTab" });
  }
});

// Listen for changes to the blocked sites and update the content script
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && "blockedSites" in changes) {
    var blockedSites = changes.blockedSites.newValue;
    var currentUrl = window.location.href.toLowerCase();

    // Check if the current URL matches any new blacklisted site
    if (blockedSites.some(site => currentUrl.includes(site))) {
      // Send a message to close the tab
      chrome.runtime.sendMessage({ action: "closeTab" });
    }
  }
});
