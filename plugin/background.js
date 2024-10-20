chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkLink") {
      const { linkDomain } = message;

      // Функция для получения цвета для домена
      async function fetchColor(domain) {
          const queryUrl = `http://90.156.219.248:8080/api/scan/uri?request=${encodeURIComponent(domain)}`;
          try {
              const response = await fetch(queryUrl, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  }
              });

              if (!response.ok) {
                  console.error(`Ошибка при проверке домена ${domain}: ${response.statusText}`);
                  sendResponse({ color: 'gray' });
                  return;
              }

              const data = await response.json();

              // API возвращает { color: "red" }, и т.д.
              let color;
              switch (data.color) {
                  case "Red":
                      color = 'red';
                      break;
                  case "Green":
                      color = 'green';
                      break;
                  case "Gray":
                  default:
                      color = 'gray';
                      break;
              }

              sendResponse({ color: color });
          } catch (error) {
              console.error(`Ошибка при обработке домена ${domain}:`, error);
              sendResponse({ color: 'gray' });
          }
      }

      fetchColor(linkDomain);

      return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "processLink") {
      const { linkDomain } = message;


      // Функция для получения цвета для домена
      async function fetchColor(domain) {
          const queryUrl = `http://90.156.219.248:8080/api/scan/domain?request=${encodeURIComponent(domain)}`;
          try {
              const response = await fetch(queryUrl, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  }
              });

              if (!response.ok) {
                  console.error(`Ошибка при проверке домена ${domain}: ${response.statusText}`);
                  sendResponse({ color: 'gray' });
                  return;
              }

              const data = await response.json();

              // API возвращает { color: "red" }, и т.д.
              let color;
              switch (data.color) {
                  case "Red":
                      color = 'red';
                      break;
                  case "Green":
                      color = 'green';
                      break;
                  case "Gray":
                  default:
                      color = 'gray';
                      break;
              }

              sendResponse({ color: color });
          } catch (error) {
              console.error(`Ошибка при обработке домена ${domain}:`, error);
              sendResponse({ color: 'gray' });
          }
      }

      fetchColor(linkDomain);

      // Возвращаем true, чтобы указать, что ответ будет отправлен асинхронно
      return true;
  }
});
