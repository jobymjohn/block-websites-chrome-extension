document.addEventListener('DOMContentLoaded', function () {
  showBlockedSites();

  // Add event listener for the "Add to blacklist" button
  document.getElementById('addToBlacklist').addEventListener('click', function () {
    addSite();
  });

  // Add event listener for the input field
  document.getElementById('newSiteInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addSite();
    }
  });
});

// Function to add a website to the blacklist
function addSite() {
  var newSite = document.getElementById('newSiteInput').value.toLowerCase();
  if (newSite) {
    chrome.storage.sync.get({ blockedSites: [] }, function (result) {
      var blockedSites = result.blockedSites;

      // Check if the site is already in the blacklist
      if (blockedSites.includes(newSite)) {
        alert("This website is already in the blacklist.");
      } else {
        // Add the site to the blacklist
        blockedSites.push(newSite);
        chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
          showBlockedSites();
        });
      }
    });
  }
}

// Function to remove a website from the blacklist
function removeSite(site) {
  // Ask for a password
  var password = prompt("Enter your password to remove the website from the blacklist:");

  // Check if the password is correct
  if (password === "your_password_here") { // Replace "your_password_here" with your actual password
    chrome.storage.sync.get({ blockedSites: [] }, function (result) {
      var blockedSites = result.blockedSites;
      var index = blockedSites.indexOf(site);
      if (index !== -1) {
        blockedSites.splice(index, 1);
        chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
          showBlockedSites();
        });
      }
    });
  } else {
    alert("Incorrect password. The website was not removed from the blacklist.");
  }
}

// Function to display the blocked websites
function showBlockedSites() {
  chrome.storage.sync.get({ blockedSites: [] }, function (result) {
    var blockedSites = result.blockedSites;
    var list = document.getElementById('blockedList');
    list.innerHTML = '';

    blockedSites.forEach(function (site) {
      var listItem = document.createElement('li');
      listItem.textContent = site;
      listItem.addEventListener('click', function () {
        removeSite(site);
      });
      list.appendChild(listItem);
    });
  });
}
