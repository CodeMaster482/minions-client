const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

function extractLinksFromText(text) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
    return text.match(urlPattern) || [];  // Returns an array of URLs or an empty array if none found
  }

const cachedLinks = new Map(JSON.parse(localStorage.getItem('cachedLinks') || '[]'));

function saveToChromeStorageAPI() {
  chrome.storage.local.set('cachedLinks', JSON.stringify([...cachedLinks]));
}

function clearCache() {
    cachedLinks.clear(); // Clear in-memory cache
    chrome.storage.local.remove('cachedLinks'); // Clear from chrome.storage
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
        domain = urlObj.hostname.replace(/^www\./, '');
    } catch (err) {
        console.error('Invalid URL:', url, err);
    }

    return domain;
}

function getCurrentPageDomain() {
    return window.location.hostname.replace(/^www\./, '');
}

function processExternalLinks() {
    const currentDomain = getCurrentPageDomain();
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkDomain = extractDomain(href);
      
        if (linkDomain && linkDomain !== currentDomain) {
            if (cachedLinks.has(href)) {
                const cachedColor = cachedLinks.get(href);
                applyLinkStyle(cachedColor);
            } else {
                chrome.runtime.sendMessage({
                    action: "checkLink",
                    href: href,
                    linkDomain: linkDomain
                }, response => {
                
                    if (response && response.color) {
                        applyLinkStyle(link, response.color);
                        processedLinks.set(href, response.color);
                        saveToLocalStorage();
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
// processExternalLinks();
