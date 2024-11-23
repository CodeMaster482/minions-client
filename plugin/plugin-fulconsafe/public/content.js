const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/; // Optimized to use RegExp constructor
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

// Cache current page domain for reuse
const currentDomain = getCurrentPageDomain();

// Throttle function to limit executions of a function
function throttle(fn, limit) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn(...args);
        }
    };
}

// Get current page's domain
function getCurrentPageDomain() {
    return window.location.hostname.replace(/^www\./, '');
}

// Extract domain from URL
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '');
    } catch (err) {
        console.error('Invalid URL:', url, err);
        return '';
    }
}

// Check if the link is an image file
function isImageLink(url) {
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// Extract redirect URL from query parameter (if exists)
function extractRedirectUrl(href) {
    const urlParams = new URLSearchParams(href);
    const redirectUrl = urlParams.get('to');
    return redirectUrl ? decodeURIComponent(redirectUrl) : null;
}

// Apply styles to the link's parent container based on the color
function applyLinkContainerStyle(link, color) {
    const container = link.parentElement;

    const styles = {
        Red: {
            border: '2px solid',
            borderColor: '#f44336',
            backgroundColor: '#ffebee',
            message: `Very dangerous link ${extractDomain(link.href)}`
        },
        Green: {
            border: '2px solid',
            borderColor: '#4caf50',
            backgroundColor: '#c8e6c9',
            message: `Safe link ${extractDomain(link.href)}`
        },
        Gray: {
            border: '2px solid',
            borderColor: '#9e9e9e',
            backgroundColor: '#f5f5f5',
            message: `Not dangerous link ${extractDomain(link.href)}`
        }
    };

    const selectedStyle = styles[color] || styles.Gray;
    Object.assign(container.style, {
        border: selectedStyle.border,
        borderColor: selectedStyle.borderColor,
        backgroundColor: selectedStyle.backgroundColor,
        // position: 'relative',
        borderRadius: '5px'
    });

    // Check if the tooltip already exists
    let details = container.querySelector('.link-tooltip');
    if (!details) {
        // Create and show link details on hover if tooltip doesn't exist
        details = document.createElement('div');
        details.classList.add('link-tooltip');  // Add a class to the tooltip for easier management
        details.innerText = selectedStyle.message;
        
        // Apply styles to the tooltip, match the border color, and ensure it appears above other elements
        Object.assign(details.style, {
            position: 'absolute',
            top: '-3vh', // Position the tooltip above the container
            left: '0',
            backgroundColor: selectedStyle.borderColor, // Match border color for tooltip
            color: 'white',
            borderRadius: '5px',
            padding: '5px',
            zIndex: '1000', // Ensure it's above all other elements
            visibility: 'hidden',
            opacity: '0',
            transition: 'visibility 0s, opacity 0.3s ease'
        });

        container.appendChild(details);

        // Show tooltip on hover
        link.addEventListener('mouseenter', () => {
            details.style.visibility = 'visible';
            details.style.opacity = '1';
        });

        // Hide tooltip when not hovered
        link.addEventListener('mouseleave', () => {
            details.style.visibility = 'hidden';
            details.style.opacity = '0';
        });
    }
}

// Process external links and apply styles
function processExternalLinks() {
    // Select all anchor tags whose href starts with 'http'
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        const href = link.getAttribute('href');

        // Skip image links
        if (isImageLink(href)) return;

        // Check for redirect URLs (encoded in query parameters)
        const decodedUrl = extractRedirectUrl(href);
        const urlToCheck = decodedUrl || href;

        // Check if the link is external
        if (urlToCheck && urlToCheck !== currentDomain) {
            chrome.runtime.sendMessage({
                action: "checkLink",
                href: href,
                linkDomain: urlToCheck
            }, response => {
                if (response && response.color) {
                    applyLinkContainerStyle(link, response.color);
                }
            });
        }
    });
}


// Create throttled version of processExternalLinks
const throttledProcessExternalLinks = throttle(processExternalLinks, 100);

// Observer to detect DOM changes and re-process links
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            throttledProcessExternalLinks();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial processing of external links
throttledProcessExternalLinks();
