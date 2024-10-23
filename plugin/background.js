// Function to load cached links from chrome.storage and convert them to a Map
async function loadCachedLinks() {
    const result = await chrome.storage.local.get('cachedLinks');
    const cachedLinks = new Map(JSON.parse(result.cachedLinks || '[]'));
    return cachedLinks;
}

// Function to save the cached links to chrome.storage
function saveToChromeStorageAPI(cachedLinks) {
    chrome.storage.local.set({ cachedLinks: JSON.stringify([...cachedLinks]) });
}

// Initialize cachedLinks when the worker is first loaded
let cachedLinks = new Map();
loadCachedLinks().then(links => cachedLinks = links);

// Function to clear the cache
function clearCache() {
    cachedLinks.clear(); // Clear in-memory cache
    chrome.storage.local.remove('cachedLinks'); // Clear from chrome.storage
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkLink" || message.action === "processLink") {
        const { linkDomain } = message;

        // Function to fetch color for a domain from the external API
        async function fetchColor(domain) {
            const queryUrl = `http://90.156.219.248:8080/api/scan/uri?request=${encodeURIComponent(domain)}`;
            try {
                const response = await fetch(queryUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    console.error(`Error checking domain ${domain}: ${response.statusText}`);
                    sendResponse({ color: 'gray' });
                    return;
                }

                const data = await response.json();

                // API returns { color: "red" }, etc.
                let color;
                switch (data.color) {
                    case "Red":
                        color = 'red';
                        break;
                    case "Green":
                        color = 'green';
                        break;
                    case "Gray":
                    default:
                        color = 'gray';
                        break;
                }

                // Cache the result
                cachedLinks.set(domain, color);
                saveToChromeStorageAPI(cachedLinks);

                sendResponse({ color: color });
            } catch (error) {
                console.error(`Error processing domain ${domain}:`, error);
                sendResponse({ color: 'gray' });
            }
        }

        // If the link is already cached, use the cached color
        if (cachedLinks.has(linkDomain)) {
            const cachedColor = cachedLinks.get(linkDomain);
            console.log('Cache hit for: ', linkDomain, 'color:', cachedColor);
            sendResponse({ color: cachedColor });
        } else {
            // Otherwise, fetch the color from the API
            fetchColor(linkDomain);
        }

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
