const urlPattern = 'https?:\/\/[^\s/$.?#].[^\s]*';

function extractLinksFromText(text) {
    return text.match(urlPattern) || [];  // Returns an array of URLs or an empty array if none found
}

function applyLinkStyle(link, color) {
  link.style.border = `2px solid ${color}`;
  link.style.backgroundColor = 'transparent';
  link.title = `This link is marked as ${color}`;
}

function throttle(fn, limit) {
    let lastCall = 0;
    return function(...args) {
        const now = (new Date()).getTime();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn(...args);
        }
    };
}

function extractDomain(url) {
    let domain = '';
    
    try {
        const urlObj = new URL(url);
        domain = urlObj.hostname.replace('^www\.', '');
    } catch (err) {
        console.error('Invalid URL:', url, err);
        return domain
    }

    return domain;
}

function getCurrentPageDomain() {
    return window.location.hostname.replace('^www\.', '');
}

function isValidUrl(url) {
    // Example RegEx: Check if URL starts with http/https and has a valid domain
    const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
    return regex.test(url);  // Return true if it matches, false otherwise
}

function normalizeUrl(url) {
    try {
        const parsedUrl = new URL(url);  // Create a URL object from the link
        parsedUrl.search = '';  // Remove query parameters
        parsedUrl.hash = '';  // Remove fragments (hashes)
        return parsedUrl.toString();  // Return normalized URL
    } catch (e) {
        return null;  // If it's not a valid URL, return null
    }
}

function processExternalLinks() {
    const currentDomain = getCurrentPageDomain();
    const links = document.querySelectorAll('a[href]');

    const uniqueLinks = new Set();

    links.forEach(link => {
        const href = link.getAttribute('href');
        console.log(href);
    });

    links.forEach(link => {
        const rawHref = link.getAttribute('href');
        if (isValidUrl(url)) {
            const normalizedUrl = normalizeUrl(rawHref);  // Normalize if valid
            
            if (normalizedUrl && normalizedUrl !== currentDomain && normalizedUrl.includes(currentDomain)) {
                chrome.runtime.sendMessage({
                    action: "checkLink",
                    href: rawHref,
                    linkDomain: normalizedUrl
                }, response => {
                    if (response && response.color) {
                        applyLinkStyle(link, response.color);
                    }
                });
            }
        }
    });
}

const throttledProcessExternalLinks = throttle(processExternalLinks, 100);

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        throttledProcessExternalLinks();  // Re-process links when the DOM changes
      }
    });
});
  
observer.observe(document.body, {
  childList: true,
  subtree: true
});

throttledProcessExternalLinks();
