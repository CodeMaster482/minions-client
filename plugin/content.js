function extractDomain(url) {
  let domain;
  // Убираем протокол и 'www.'
  if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
  } else {
      domain = url.split('/')[0];
  }
  // Убираем 'www.'
  domain = domain.split(':')[0].replace('www.', '');
  return domain;
}


function getPageDomains() {
  let links = document.querySelectorAll('a'); // Находим все элементы <a>
  
  // Фильтруем ссылки, оставляем только те, что содержат http или https, и не пустые
  let validLinks = Array.from(links)
      .map(link => link.href)
      .filter(href => href && (href.startsWith('http://') || href.startsWith('https://')));
  
  // Извлекаем домены из валидных ссылок
  let domains = validLinks.map(link => extractDomain(link));
  
  // Убираем дубликаты
  let uniqueDomains = [...new Set(domains)];
  
  return uniqueDomains;
}

// Отправка доменов на сервер
chrome.runtime.sendMessage({ action: "sendLinks", links: getPageDomains() });
  
  // Получение ответа от фонового скрипта и окрашивание ссылок
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlightLinks") {
        let links = document.querySelectorAll('a');
        links.forEach(link => {
            let linkDomain = extractDomain(link.href);
            if (message.greenLinks.includes(linkDomain)) {
                link.style.backgroundColor = 'green'; // Помечаем зелёным
            } else if (message.redLinks.includes(linkDomain)) {
                link.style.backgroundColor = 'red'; // Помечаем красным
            }
        });
    }
});

  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === "sendLinks") {
    // Отправляем массив ссылок на сервер
    console.log(JSON.stringify({ links: message.links }))

    fetch("https://your-backend-server.com/process-links", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ links: message.links })
    })
    .then(response => response.json())
    .then(data => {
    // Получаем массивы ссылок для зелёных и красных меток
    let greenLinks = data.greenLinks || [];
    let redLinks = data.redLinks || [];
    
    // Отправляем эти данные обратно в content.js для изменения стилей
    chrome.tabs.sendMessage(sender.tab.id, {
        action: "highlightLinks",
        greenLinks: greenLinks,
        redLinks: redLinks
    });
    })
    .catch(error => console.error("Error processing links:", error));
}
});
