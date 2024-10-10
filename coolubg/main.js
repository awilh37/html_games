function insertIntoHead(content) {
    const head = document.head || document.getElementsByTagName('head')[0];

    // Create a range to parse the HTML content
    const range = document.createRange();
    range.selectNode(head);

    // Create a fragment to hold the parsed content
    const fragment = range.createContextualFragment(content);

    // Append the fragment to the head
    head.appendChild(fragment);
}

// Function to load an external script dynamically
function loadScript(url) {
    var script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.head.appendChild(script);
}

// Load pages.js

function insertHTMLIntoBody() {
    // Create a new div element
    const div = document.createElement('div');
    div.className = 'fixed-background'; // Set the class directly

    // Append the new div to the body
    document.body.appendChild(div);
}

insertHTMLIntoBody();

//function setDefaultLocalStorageValues() {
//  if (!localStorage.getItem('background-image')) {
//     localStorage.setItem('background-image', '/background.png');
// }
// if (!localStorage.getItem('primary-color')) {
//    localStorage.setItem('primary-color', '#11E2C');
// }
// if (!localStorage.getItem('secondary-color')) {
//     localStorage.setItem('secondary-color', '#58AAFC');
// }
// if (!localStorage.getItem('background-res')) {
//   localStorage.setItem('background-res', '1280');
//}
//if (!localStorage.getItem('selectedButton')) {
//  localStorage.setItem('selectedButton', 'primary'); // Set default button to primary
//}
//}

// bad method :) - checks whether primary colour has a value, if it doesnt then it resets all customisation values.
function setDefaultValuesIfPrimaryColorMissing() {
    const customisationData = localStorage.getItem('customisation');

    // Check if the "customisation" data is missing or the primary color is missing/empty
    if (!customisationData || customisationData.split('\n')[1] === '') {
        const defaultCustomisation = [
            '/background.png',  // Default background image
            '#111E2C',          // Default primary color
            '#58AAFC',          // Default secondary color
            '1280'              // Default background resolution
        ].join('\n');

        // Store the default values in the "customisation" key
        localStorage.setItem('customisation', defaultCustomisation);
    }
}


// Call the function to set default values if primary-color is missing
setDefaultValuesIfPrimaryColorMissing();

//document.addEventListener('DOMContentLoaded', function() {
//  setDefaultLocalStorageValues();
//});

document.addEventListener('DOMContentLoaded', function () {
    // Set server button if it hasnt been set already
    if (!localStorage.getItem("selectedButton")) {
        localStorage.setItem("selectedButton", "primary"); //Default to primary - Line 310
    }

    // Fetch and insert navbar and title bar
    fetch('/navbar.html')
        .then(response => response.text())
        .then(data => {
            var tempContainer = document.createElement('div');
            tempContainer.innerHTML = data;

            var navbarContainer = document.getElementById('navbar-container');
            navbarContainer.innerHTML = tempContainer.innerHTML;

            // Set a high z-index directly
            navbarContainer.style.position = 'relative'; // Or 'absolute' / 'fixed' based on your layout
            navbarContainer.style.zIndex = '9999'; // Or a high enough value to ensure it's on top

            attachNavbarListeners();
            updateButtonState(localStorage.getItem('selectedButton'));
        })
        .catch(error => console.error('Error loading navbar:', error));

            fetch('/titlebar.html')
              .then(response => response.text())
              .then(data => {
                const titlebarContainer = document.getElementById('titlebar-container');
                titlebarContainer.innerHTML = ''; // Clear existing content
                titlebarContainer.innerHTML = data; // Insert new content
          
                // Set title and author if defined
                if (typeof titleText !== 'undefined') {
                  document.getElementById('title-text').textContent = titleText;
                }
                if (typeof author !== 'undefined' && typeof authorLink !== 'undefined') {
                  document.getElementById('author-text').innerHTML = `<a href="${authorLink}">${author}</a>`;
                }
          
                // Set up polling mechanism with maximum time limit
                var maxPollingTime = 8000; // Maximum polling time in milliseconds (e.g., 5 seconds)
                var startTime = Date.now();
                var pollingInterval = setInterval(() => {
                  const iframe = document.getElementById('game-iframe');
                  const titleBar = document.getElementById('dynamic-title-bar');
                  if (iframe && titleBar) {
                    titleBar.style.width = `${iframe.offsetWidth - 40}px`;
                    clearInterval(pollingInterval); // Stop polling once title bar width is set
                  } else if (Date.now() - startTime > maxPollingTime) {
                    clearInterval(pollingInterval); // Stop polling after timeout
                    console.warn('Timeout reached: title bar or iframe not found.');
                  }
                }, 100);
          
                loadIframe(); // Load iframe after title bar content is loaded
              })
              .catch(error => console.error('Error loading title bar:', error));
          });
// Function to load an external script dynamically with a Promise
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}

// Load pages-long.js and then initialize search functionality
function loadIframe() {
    var selectedButton = localStorage.getItem('selectedButton') || 'primary';
    var iframeSrc = selectedButton === 'primary' ? getPrimarySrc() : getBackupSrc();
    var gameVariable = getGameVariable();
    iframeSrc += gameVariable;

    var iframe = document.getElementById('game-iframe');

    // Directly include the Ruffle script URL
    var ruffleScript = document.createElement('script');
    ruffleScript.src = "https://unpkg.com/@ruffle-rs/ruffle";

    // Attach the script to the DOM and set the source
    document.head.appendChild(ruffleScript);

    // Set the source of the iframe
    iframe.src = iframeSrc;
    updateButtonState(selectedButton);
}

function setIframeSrc(url, button) {
    var iframe = document.getElementById('game-iframe');

    if (iframe) {
        if (confirm('Are you sure you want to change the game? Any unsaved progress may be lost.')) {
            localStorage.setItem('selectedButton', button);

            // Set the source of the iframe
            iframe.src = url + getGameVariable(); // Uses gameText
            updateButtonState(button);
        }
    } else {
        localStorage.setItem('selectedButton', button);
        location.reload();
    }
}


function getPrimarySrc() {
    return 'https://coolubg.github.io/coolubg-list/';
}

function getBackupSrc() {
    return 'https://coolubg2.github.io/coolubg-list/';
}

function getGameVariable() {
    return typeof gameName !== 'undefined' ? gameName : '';
}

function updateButtonState(selectedButton) {
    var primaryButton = document.getElementById('primary-button');
    var backupButton = document.getElementById('backup-button');

    primaryButton.classList.remove('selected');
    backupButton.classList.remove('selected');

    if (selectedButton === 'primary') {
        primaryButton.classList.add('selected');
    } else {
        backupButton.classList.add('selected');
    }

    primaryButton.textContent = "Primary" + (selectedButton === 'primary' ? "" : "");
    backupButton.textContent = "Secondary" + (selectedButton === 'backup' ? "" : "");
}

document.addEventListener('DOMContentLoaded', function () {
    const customisation = localStorage.getItem('customisation');
    const fixedBackgroundImg = document.querySelector('.fixed-background');

    if (customisation) {
        // Split the string into lines
        const lines = customisation.split('\n');

        // Ensure there are at least 4 lines
        if (lines.length >= 4) {
            const backgroundRes = parseInt(lines[3].trim());
            if (!isNaN(backgroundRes)) {
                fixedBackgroundImg.style.backgroundSize = `${backgroundRes}px auto`;
            }
        }
    }
});


function fullscreenFunction1() {
    var iframe = document.getElementById('game-iframe');
    if (!iframe) return;

    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
    }
}
function fullscreenFunction2() {
    var gameElement = document.getElementById('game-iframe');
    if (!gameElement) return;

    var gameSrc = gameElement.src;

    // Create the HTML content as a Blob
    var htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Fullscreen Game</title>
    <style>
        html, body { height: 100%; margin: 0; overflow: hidden; }
        #iframe { width: 100vw; height: 100vh; border: none; }
    </style>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.documentElement.requestFullscreen();
        });
    </script>
</head>
<body>
    ${gameElement.tagName === 'IFRAME'
        ? `<iframe id="iframe" src="${gameSrc}"></iframe>`
        : `<embed id="iframe" src="${gameSrc}" type="application/x-shockwave-flash">`
    }
</body>
</html>

    `;

    // Create a Blob and URL for the HTML content
    var blob = new Blob([htmlContent], { type: 'text/html' });
    var blobUrl = URL.createObjectURL(blob);

    // Open the new tab with the Blob URL
    var newTab = window.open(blobUrl, '_blank');

    if (!newTab) {
        alert('Failed to open new tab. Please check your browser settings.');
    }

    // Clean up Blob URL
    newTab.addEventListener('unload', () => {
        URL.revokeObjectURL(blobUrl);
    });
}

function applyStoredSettings() {
    // Get the "customisation" data from localStorage
    const customisationData = localStorage.getItem('customisation');

    if (customisationData) {
        // Split the data by newline to get each individual setting
        const [backgroundImage, primaryColor, secondaryColor, backgroundRes] = customisationData.split('\n');
        const fixedBackgroundImg = document.querySelector('.fixed-background');

        // Apply the background image if it exists
        if (fixedBackgroundImg && backgroundImage) {
            fixedBackgroundImg.style.backgroundImage = `url('${backgroundImage}')`;
        }

        // Apply the primary color if it exists
        if (primaryColor) {
            document.documentElement.style.setProperty('--primary-color', primaryColor);
        }

        // Apply the secondary color if it exists
        if (secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            document.querySelector('.container').style.backgroundColor = secondaryColor;
        }

        // Apply the background resolution if it exists
        if (backgroundRes) {
            fixedBackgroundImg.style.backgroundSize = `${backgroundRes}px auto`;
        }
    }
}

window.addEventListener('load', applyStoredSettings);

document.getElementById('settings-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const backgroundImageValue = document.getElementById('background-image').value;
    const primaryColorValue = document.getElementById('primary-color').value;
    const secondaryColorValue = document.getElementById('background-color').value;
    const backgroundResValue = document.getElementById('background-res').value;

    // Combine the values into a single string, with each value separated by a newline
    const customisationData = `${backgroundImageValue}\n${primaryColorValue}\n${secondaryColorValue}\n${backgroundResValue}`;

    // Store the combined string in localStorage under the key "customisation"
    localStorage.setItem('customisation', customisationData);

    // Reload the page to apply changes
    location.reload();
});
