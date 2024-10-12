// Функция для извлечения всех ссылок с веб-страницы
function getPageLinks() {
    let links = document.querySelectorAll('a'); // Находим все элементы <a>
    let linkArray = Array.from(links).map(link => link.href); // Создаём массив ссылок
    return linkArray;
  }
  
  // Отправка ссылок на сервер
  chrome.runtime.sendMessage({ action: "sendLinks", links: getPageLinks() });
  
  // Получение ответа от фонового скрипта и окрашивание ссылок
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlightLinks") {
        let links = document.querySelectorAll('a');
        links.forEach(link => {
        if (message.greenLinks.includes(link.href)) {
          link.style.backgroundColor = 'green'; // Помечаем зелёным
        } else if (message.redLinks.includes(link.href)) {
          link.style.backgroundColor = 'red'; // Помечаем красным
        }
      });
    }
});
  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if (message.action === "sendLinks") {
    // Отправляем массив ссылок на сервер
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
