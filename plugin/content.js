// извлечения домена из URL
function extractDomain(url) {
  let domain = '';
  try {
      const urlObj = new URL(url);
      domain = urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
  }
  return domain;
}

function getCurrentPageDomain() {
  return window.location.hostname.replace(/^www\./, '');
}

// обработки всех внешних ссылок на странице
function processExternalLinks() {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
      const href = link.getAttribute('href');
      const linkDomain = extractDomain(href);
      
      if (linkDomain !== "") {
        

        chrome.runtime.sendMessage({
            action: "checkLink",
            href: href,
            linkDomain: linkDomain
        }, response => {
            // Обновляем стиль ссылки
            if (response && response.color) {
                link.style.border = `2px solid ${response.color}`;
                link.style.backgroundColor = 'transparent';
                link.title = `Эта ссылка помечена как ${response.color}`;
            }
        });
      }
  });
}

// Запускаем обработку внешних ссылок при загрузке страницы
processExternalLinks();
