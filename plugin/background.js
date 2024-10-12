// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "sendLinks") {
//     // Отправляем массив ссылок на сервер
//     console.log(JSON.stringify({ links: message.links }))
//     fetch("https://127.0.0.1", {
//       method: "POST",
//       body: JSON.stringify({ links: message.links })
//     })
//     .then(response => response.json())
//     .then(data => {
//       // Получаем массивы ссылок для зелёных и красных меток
//       let greenLinks = data.greenLinks || [];
//       let redLinks = data.redLinks || [];
      
//       // Отправляем эти данные обратно в content.js для изменения стилей
//       chrome.tabs.sendMessage(sender.tab.id, {
//         action: "highlightLinks",
//         greenLinks: greenLinks,
//         redLinks: redLinks
//       });
//     })
//     .catch(error => console.error("Error processing links:", error));
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendLinks") {
    let link = message.links[0];  // Берём только первую ссылку из массива
   
    let queryUrl = `http://127.0.0.1:8080/api/scan/url?request=${encodeURIComponent(link)}`; // Корректный синтаксис
    console.log(queryUrl)
    // Отправляем запрос с одной ссылкой
    fetch(queryUrl, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      console.log("response:", data)
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

