document.getElementById('processLink').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    console.log(url)
    if (url) {
        chrome.runtime.sendMessage({ action: "processLink", url: url }, function(response) {
            if (response.error) {
                console.error("Error from background:", response.error);
            } else {
                console.log("Server response:", response);
            }
        });
    } else {
        alert('Please enter a valid URL.');
    }
});