document.getElementById('processLink').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        alert('Пожалуйста, введите ссылку.');
        return;
    }

    fetch('http://90.156.219.248:8080/api/scan/uri?request=' + encodeURIComponent(url))
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('mainContent').innerHTML = `
                <div class="result-container text-center">
                    <h3>Результат</h3>
                    <p class="alert alert-info">${data.Zone}</p>
                    <button id="backButton" class="btn btn-primary btn-back">Назад</button>
                </div>
            `;
            
            document.getElementById('backButton').addEventListener('click', function() {
                document.getElementById('mainContent').innerHTML = ``;
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});