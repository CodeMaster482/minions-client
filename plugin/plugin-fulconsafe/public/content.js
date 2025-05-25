const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/;
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

const currentDomain = getCurrentPageDomain();

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

function getCurrentPageDomain() {
    return window.location.hostname.replace(/^www\./, '');
}

function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '');
    } catch (err) {
        console.error('Invalid URL:', url, err);
        return '';
    }
}

function isImageLink(url) {
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

function extractRedirectUrl(href) {
    const urlParams = new URLSearchParams(href);
    const redirectUrl = urlParams.get('to');
    return redirectUrl ? decodeURIComponent(redirectUrl) : null;
}

// Добавляем иконку рядом с ссылкой
function applyLinkContainerStyle(link, color) {
    const existingIcon = link.querySelector('.scan-icon');
    if (existingIcon) existingIcon.remove();

    const icon = document.createElement('span');
    icon.classList.add('scan-icon');

    // Выбор иконки и цвета
    let emoji = '⚪'; // Default: gray dot
    let tooltip = `Unknown link: ${extractDomain(link.href)}`;
    let emojiColor = '#9e9e9e';

    if (color === 'Green') {
        emoji = '✅';
        emojiColor = '#4caf50';
        tooltip = `Safe link: ${extractDomain(link.href)}`;
    } else if (color === 'Red') {
        emoji = '⚠️';
        emojiColor = '#f44336';
        tooltip = `Very dangerous link: ${extractDomain(link.href)}`;

        const warningUrl = chrome.runtime.getURL("warning.html") + "?url=" + encodeURIComponent(link.href);
        link.setAttribute('href', warningUrl);
    }

    icon.innerText = emoji;
    Object.assign(icon.style, {
        fontSize: '14px',
        marginLeft: '6px',
        color: emojiColor,
        verticalAlign: 'middle',
        userSelect: 'none'
    });

    icon.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    
        try {
            const url = new URL(link.href);
            const cleanUrl = `${url.origin}${url.pathname}`; // Без query и hash
    
            navigator.clipboard.writeText(cleanUrl).then(() => {
                icon.title = `Скопировано: ${cleanUrl}`;
                icon.innerText = '📋';
    
                setTimeout(() => {
                    icon.innerText = emoji;
                    icon.title = tooltip;
                }, 1000);
            }).catch(err => {
                console.error('Не удалось скопировать ссылку:', err);
            });
        } catch (e) {
            console.error('Некорректный URL:', link.href);
        }
    });

    link.appendChild(icon);
    link.title = tooltip;
}

function processExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        // Пропуск уже обработанных ссылок
        if (link.dataset.scanStatus === "done") return;

        const href = link.getAttribute('href');
        if (isImageLink(href)) return;

        const decodedUrl = extractRedirectUrl(href);
        const urlToCheck = decodedUrl || href;
        const linkDomain = extractDomain(urlToCheck);

        if (urlToCheck && linkDomain !== currentDomain) {
            // Проверка кэша
            // if (cachedLinks.has(linkDomain)) {
            //     //const cachedColor = cachedLinks.get(linkDomain);
            //     applyLinkContainerStyle(link, capitalize(cachedColor));
            //     link.dataset.scanStatus = "done";
            //     return;
            // }

            chrome.runtime.sendMessage({
                action: "checkLink",
                href: href,
                linkDomain: linkDomain
            }, response => {
                if (response && response.color) {
                    const color = capitalize(response.color);
                    applyLinkContainerStyle(link, color);

                    // Кэширование
                    //cachedLinks.set(linkDomain, color);
                    //saveToChromeStorageAPI(cachedLinks);

                    link.dataset.scanStatus = "done";
                }
            });
        }
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const throttledProcessExternalLinks = throttle(processExternalLinks, 100);

const observer = new MutationObserver(mutations => {
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

throttledProcessExternalLinks();
