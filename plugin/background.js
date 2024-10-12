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
  