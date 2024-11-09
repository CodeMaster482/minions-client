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



function processExternalLinks() {
    const currentDomain = getCurrentPageDomain();
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        const href = link.getAttribute('href');
        console.log(href);
    });

    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkDomain = extractDomain(href);
      
        if (linkDomain && linkDomain !== currentDomain) {
            chrome.runtime.sendMessage({
                action: "checkLink",
                href: href,
                linkDomain: linkDomain
            }, response => {
            
                if (response && response.color) {
                    applyLinkStyle(link, response.color);
                }
            });
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
