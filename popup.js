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

/// Function to add a website to the blacklist
function addSite() {
  var newSite = document.getElementById('newSiteInput').value.toLowerCase();
  var fromTime = prompt("Enter the starting time (HH:MM) to block the website:");
  var toTime = prompt("Enter the ending time (HH:MM) to block the website:");

  if (newSite && isValidTime(fromTime) && isValidTime(toTime)) {
    chrome.storage.sync.get({ blockedSites: [] }, function (result) {
      var blockedSites = result.blockedSites;

      // Check if the site is already in the blacklist
      if (blockedSites.some(entry => entry.site === newSite)) {
        alert("This website is already in the blacklist.");
      } else {
        // Convert times to 24-hour format in minutes
        var fromTimeConverted = convertTo24Hour(fromTime);
        var toTimeConverted = convertTo24Hour(toTime);

        // Check if the conversion was successful
        if (fromTimeConverted !== null && toTimeConverted !== null) {
          // Add the site to the blacklist with specified timing
          blockedSites.push({ site: newSite, from: fromTimeConverted, to: toTimeConverted });
          chrome.storage.sync.set({ blockedSites: blockedSites }, function () {
            showBlockedSites();
            console.log('Added site to the blacklist:', newSite);
          });
        } else {
          alert("Invalid input. Please enter a valid website and timing.");
        }
      }
    });
  } else {
    alert("Invalid input. Please enter a valid website and timing.");
  }
}


// Function to remove a website from the blacklist
function removeSite(site) {
  // Ask for a password with a callback
  getPassword(function (password) {
    // Check if the password is correct
    if (password === "your_password_here") { // Replace "your_password_here" with your actual password
      chrome.storage.sync.get({ blockedSites: [] }, function (result) {
        var blockedSites = result.blockedSites;
        var index = blockedSites.findIndex(entry => entry.site === site);
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
  });
}

// Function to display the blocked websites
function showBlockedSites() {
  chrome.storage.sync.get({ blockedSites: [] }, function (result) {
    var blockedSites = result.blockedSites;
    var list = document.getElementById('blockedList');
    list.innerHTML = '';

    blockedSites.forEach(function (entry) {
      var listItem = document.createElement('li');

      // Create an "X" button for each website
      var removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.style.marginRight = '5px';

      // Add an event listener to the "X" button to prompt for removal
      removeButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the LI click event from firing

        var confirmRemove = confirm("Are you sure you want to remove this website?");
        if (confirmRemove) {
          removeSite(entry.site);
        }
      });

      // Add the "X" button before the website name
      listItem.appendChild(removeButton);

      // Format the timing as "HH:MM-HH:MM"
      var fromTimeText = formatTime(entry.from);
      var toTimeText = formatTime(entry.to);
      var timingText = fromTimeText + " - " + toTimeText;

      // Add the website name and timing (Blocked from HH:MM to HH:MM)
      listItem.appendChild(document.createTextNode(entry.site + " (Blocked from " + timingText + ")"));

      list.appendChild(listItem);
    });
  });
}

// Function to format time as "HH:MM"
function formatTime(minutes) {
  var hours = Math.floor(minutes / 60);
  var minutesPart = minutes % 60;
  return ("0" + hours).slice(-2) + ":" + ("0" + minutesPart).slice(-2);
}

// Function to check if the entered time is in valid HH:MM format
function isValidTime(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Function to convert time to 24-hour format
function convertTo24Hour(time) {
  var hoursMinutes = time.split(":");
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = parseInt(hoursMinutes[1], 10);

  // Ensure the entered time is valid
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

// Function to prompt for password with masking
function getPassword(callback) {
  var passwordInput = document.createElement("input");
  passwordInput.type = "password";

  var modalContainer = document.createElement("div");
  modalContainer.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 999;";

  var modalContent = document.createElement("div");
  modalContent.style.cssText = "background: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);";

  var label = document.createElement("label");
  label.textContent = "Enter your password:";
  label.style.cssText = "display: block; margin-bottom: 10px;";

  var okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.addEventListener("click", function () {
    modalContainer.remove();
    callback(passwordInput.value);
  });

  modalContent.appendChild(label);
  modalContent.appendChild(passwordInput);
  modalContent.appendChild(okButton);

  modalContainer.appendChild(modalContent);

  document.body.appendChild(modalContainer);

  // Set a small delay to focus on the input field
  setTimeout(function () {
    passwordInput.focus();
  }, 100);
}
