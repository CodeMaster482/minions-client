const urlGood = "alert alert-info"
const urlDanger = "alert alert-danger"
const urlGray = "alert alert-dark"

document.addEventListener('DOMContentLoaded', function() {
    // Вызываем функцию для инициализации интерфейса
    renderInputForm();
});

navbar = `<ul>
            <li><a href="#" id="URLLink">ссылка</a></li>
            <li><a href="#" id="fileUploadLink">файл</a></li>
        </ul>`;
        
// Функция для рендеринга формы ввода
function renderInputForm() {
    const inputTemplate =
        `
        ${navbar}
        <div class="form-container">
            <h3>Проверить</h3>
            <div class="mb-3">
                <input type="text" class="form-control" id="urlInput" placeholder="Вставьте сюда ссылку/домен">
                <div class="invalid-feedback" id="inputError">Пожалуйста, введите корректную ссылку.</div>
            </div>
            <div class="d-grid gap-2">
                <button id="processLink" class="btn btn-success">Отправить</button>
            </div>
        </div>`;
    document.getElementById('index').innerHTML = inputTemplate;

    attachProccesLink();
    attachFileUploadLink();
    attachURLLink();
}



// Функция для рендеринга результата
function renderResult(data) {
    let infoAboutURL = "";
    let alertClass = "alert-secondary";

    // Определение уровня опасности
    switch (data.Zone) {
        case "Red":
            alertClass = "alert-danger";
            infoAboutURL = "данная ссылка опасна";
            break;
        case "Green":
            alertClass = "alert-success";
            infoAboutURL = "данная ссылка безопасна";
            break;
        default:
            infoAboutURL = "нет точной информации";
            break;
    }

    // Рендеринг информации о IP
    let ipInfo = "";
    if (data.IpGeneralInfo) {
        let ipCategories = (data.IpGeneralInfo.Categories || []).join(", ");
        ipInfo = `
            <h4>Информация об IP</h4>
            <p><strong>IP:</strong> ${data.IpGeneralInfo.Ip}</p>
            ${ipCategories ? ` <p><strong>Категория:</strong> ${ipCategories}</p>` : ""}
            <p><strong>Страна:</strong> ${data.IpGeneralInfo.CountryCode || "нет данных"}</p>`;
    }

    // Рендеринг информации о домене
    let domainInfo = "";
    if (data.DomainGeneralInfo) {
        let domainCategories = (data.DomainGeneralInfo.Categories || []).join(", ");
        domainInfo = `
            <h4>Информация о домене</h4>
            <p><strong>Домен:</strong> ${data.DomainGeneralInfo.Domain}</p>
            ${domainCategories ? ` <p><strong>Категория:</strong> ${domainCategories}</p>` : ""}
            <p><strong>Количество файлов:</strong> ${data.DomainGeneralInfo.FilesCount || 0}</p>
            <p><strong>Количество IP:</strong> ${data.DomainGeneralInfo.Ipv4Count || 0}</p>
            <p><strong>Количество обращений:</strong> ${data.DomainGeneralInfo.HitsCount || 0}</p>`;
    }

    // Рендеринг информации о URL
    let urlInfo = "";
    if (data.UrlGeneralInfo) {
        let urlCategories = (data.UrlGeneralInfo.Categories || []).join(", ");
        urlInfo = `
            <h4>Информация о URL</h4>
            <p><strong>URL:</strong> ${data.UrlGeneralInfo.Url}</p>
            ${urlCategories ? ` <p><strong>Категория:</strong> ${urlCategories}</p>` : ""}
            <p><strong>Количество файлов:</strong> ${data.UrlGeneralInfo.FilesCount || 0}</p>`;
    }
ы
    const resultTemplate = `
        ${navbar}
        <div class="container mt-4">
            <h3>Результат</h3>
            <div class="alert ${alertClass}">
                ${ipInfo ? `${ipInfo}` : ""}
                ${domainInfo ? `${domainInfo}` : ""}
                ${urlInfo ? `${urlInfo}` : ""}
                <p><strong>Опасность:</strong> ${infoAboutURL}</p>

            </div>

            <div class="d-grid gap-2 mb-4">
                <button id="backButton" class="btn btn-danger">Назад</button>
            </div>
        </div>`;

    // Вставляем результат на страницу
    document.getElementById('index').innerHTML = resultTemplate;
}

// Привязка события для перехода на drag-and-drop форму
function attachURLLink() {
    document.getElementById('URLLink').addEventListener('click', function(event) {
        event.preventDefault();
        renderInputForm();
    });
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
        const urlInput = document.getElementById('urlInput');
        const url = urlInput.value;
        const inputError = document.getElementById('inputError');

        if (!url) {
            // Показываем ошибку, если поле пустое
            urlInput.classList.add('is-invalid');
            inputError.style.display = 'block';
            return;
        } else {
            // Убираем ошибку, если поле заполнено
            urlInput.classList.remove('is-invalid');
            inputError.style.display = 'none';
        }

        fetch(`http://90.156.219.248:8080/api/scan/uri?request=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка: статус ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                renderResult(data);
                attachBackButtonListener();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                // Показываем ошибку в случае проблем с сервером
                document.getElementById('index').innerHTML = 
                    `<div class="form-container">
                        <h3>Ошибка</h3>
                        <p class="alert alert-danger">Произошла ошибка: ${error.message}</p>
                        <div class="d-grid gap-2">
                            <button id="backButton" class="btn btn-danger">Назад</button>
                        </div>
                    </div>`;
                attachBackButtonListener();
            });
    });
}

// Функция для рендеринга интерфейса drag-and-drop
function renderFileUploadForm() {
    const fileUploadTemplate = navbar + 
        `<div class="form-container">
            <h3>Загрузите файл</h3>
            <div id="dropZone" class="drop-zone border border-primary" style="padding: 50px; text-align: center;">
                <p>Перетащите файл сюда или нажмите, чтобы выбрать файл</p>
                <input type="file" id="fileInput" style="display: none;" />
            </div>
            <div id="fileInfo" class="mt-3"></div>
            <div class="d-grid gap-2 mb-4">
                <button id="backButton" class="btn btn-danger">Назад</button>
            </div>
        </div>`;

    document.getElementById('index').innerHTML = fileUploadTemplate;
    attachBackButtonListener();
    attachURLLink();
    attachDragAndDropHandlers();
}

// Привязка события для перехода на drag-and-drop форму
function attachFileUploadLink() {
    document.getElementById('fileUploadLink').addEventListener('click', function(event) {
        event.preventDefault();
        renderFileUploadForm();
    });
}

// Обработка drag-and-drop событий
function attachDragAndDropHandlers() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    dropZone.addEventListener('click', function() {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropZone.classList.add('border-success');
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('border-success');
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropZone.classList.remove('border-success');
        const files = event.dataTransfer.files;
        handleFileUpload(files[0]);
    });

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        handleFileUpload(files[0]);
    });
}

// Обработка загруженного файла
function handleFileUpload(file) {
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `<p><strong>Файл загружен:</strong> ${file.name}</p>`;

    // Создаем объект FormData и добавляем файл
    const formData = new FormData();
    formData.append('file', file);

    // Отправляем запрос на сервер
    fetch(`http://90.156.219.248:8080/api/scan/file`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка: статус ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        renderFileResult(data); // Рендерим результат после получения данных
        attachBackButtonListener();
    })
    .catch(error => {
        console.error('Ошибка:', error);
        // Показываем ошибку в случае проблем с сервером
        document.getElementById('index').innerHTML = 
            `<div class="form-container">
                <h3>Ошибка</h3>
                <p class="alert alert-danger">Произошла ошибка: ${error.message}</p>
                <div class="d-grid gap-2">
                    <button id="backButton" class="btn btn-danger">Назад</button>
                </div>
            </div>`;
        attachBackButtonListener();
    });
}

// Функция для рендеринга результата анализа файла
function renderFileResult(data) {
    let alertClass = "alert-secondary";
    let infoAboutFile = "нет точной информации";

    // Определение зоны опасности
    switch (data.Zone) {
        case "Red":
            alertClass = "alert-danger";
            infoAboutFile = "Файл содержит угрозу";
            break;
        case "Green":
            alertClass = "alert-success";
            infoAboutFile = "Файл безопасен";
            break;
        default:
            alertClass = "alert-warning";
            infoAboutFile = "Не удалось определить статус файла";
            break;
    }

    // Информация о файле
    const fileGeneralInfo = data.FileGeneralInfo || {};
    const detectionInfo = (data.DetectionsInfo || []).map(info => `
        <p><strong>Метод обнаружения:</strong> ${info.DetectionMethod}</p>
        <p><strong>Название угрозы:</strong> ${info.DetectionName}</p>
        <p><strong>Зона:</strong> ${info.Zone}</p>
    `).join('');

    const resultTemplate = `
        ${navbar}
        <div class="container mt-4">
            <h3>Результат проверки файла</h3>
            <div class="alert ${alertClass}">
                <p><strong>Опасность:</strong> ${infoAboutFile}</p>
                <p><strong>Тип файла:</strong> ${fileGeneralInfo.Type || 'нет данных'}</p>
                <p><strong>Размер файла:</strong> ${fileGeneralInfo.Size || 'нет данных'} байт</p>
                ${detectionInfo}
            </div>

            <div class="d-grid gap-2 mb-4">
                <button id="backButton" class="btn btn-danger">Назад</button>
            </div>
        </div>`;

    // Вставляем результат на страницу
    document.getElementById('index').innerHTML = resultTemplate;
    attachURLLink();
}


// Функция для привязки события на кнопку "Назад"
function attachBackButtonListener() {
    document.getElementById('backButton').addEventListener('click', function() {
        renderInputForm();
    });
}