document.addEventListener('DOMContentLoaded', function() {
    // Вызываем функцию для инициализации интерфейса
    renderInputForm();
});

navbar = `<ul>
            <li><a href="default.php">ссылка</a></li>
            <li><a href="news.php">файл</a></li>
        </ul>
        `

// Функция для рендеринга формы ввода
function renderInputForm() {
    const inputTemplate = navbar + `
        <div class="form-container">
            <h3>Проверить</h3>
            <div class="mb-3">
                <input type="text" class="form-control" id="urlInput" placeholder="Вставьте сюда ссылку/домен">
            </div>
            <div class="d-grid gap-2">
                <button id="processLink" class="btn btn-success">Отправить</button>
            </div>
        </div>
    `;
    document.getElementById('index').innerHTML = inputTemplate;

    attachProccesLink()
}

// Функция для рендеринга результата
function renderResult(data) {
    const resultTemplate = navbar + `
        <div class="result-container text-center">
            <h3>Результат</h3>
            <p class="alert alert-info">${data.Zone}</p>
            <button id="backButton" class="btn btn-primary btn-back">Назад</button>
        </div>
    `;
    document.getElementById('index').innerHTML = resultTemplate;
}

// Функция для привязки события на кнопку "Назад"
function attachBackButtonListener() {
    document.getElementById('backButton').addEventListener('click', function() {
        renderInputForm();
    });
}

function attachProccesLink() {
    // Восстанавливаем слушатель события для кнопки "Отправить"
    const processLinkBtn = document.getElementById('processLink');

    processLinkBtn.addEventListener('click', function() {
        const url = document.getElementById('urlInput').value;
        if (!url) {
            alert('Пожалуйста, введите ссылку.');
            return;
        }

        fetch(`http://90.156.219.248:8080/api/scan/uri?request=${encodeURIComponent(url)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                renderResult(data);
                attachBackButtonListener();
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });
}