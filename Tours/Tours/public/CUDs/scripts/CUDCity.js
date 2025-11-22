// Переменная для хранения списка стран
let countries = [];

// Функция для загрузки списка стран
async function loadCountries() {
    try {
        const response = await fetch('/CountriesAPI/all');
        countries = await response.json();
        const countrySelect = document.getElementById('countryId');
        const editCountrySelect = document.getElementById('editCountryId');

        // Очищаем селекты
        countrySelect.innerHTML = '<option value="">Выберите страну</option>';
        editCountrySelect.innerHTML = '<option value="">Выберите страну</option>';

        // Заполняем селекты
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.Id;
            option.textContent = country.Name;
            countrySelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = country.Id;
            editOption.textContent = country.Name;
            editCountrySelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки стран:', error);
    }
}

// Функция для загрузки списка городов
async function loadCities() {
    try {
        const response = await fetch('/CitiesAPI/all');
        const cities = await response.json();
        const tableBody = document.getElementById('citiesTableBody');

        tableBody.innerHTML = '';
        cities.forEach(city => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${city.Id}</td>
                        <td>${city.Name}</td>
                        <td>${city.CountryId}</td>
                        <td>${getCountryName(city.CountryId)}</td>
                        <td>
                            <button onclick="fillEditForm(${city.Id}, '${city.Name}', ${city.CountryId})">Редактировать</button>
                            <button onclick="deleteCity(${city.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки городов:', error);
    }
}

// Функция для получения названия страны по ID
function getCountryName(countryId) {
    const country = countries.find(c => c.Id == countryId);
    return country ? country.Name : 'Неизвестно';
}

// Функция для заполнения формы редактирования
function fillEditForm(id, name, countryId) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editCountryId').value = countryId;
}

// Обработчик создания города
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');
    const countryId = formData.get('countryId');

    try {
        const response = await fetch('/CitiesAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                countryId: parseInt(countryId)
            })
        });

        if (response.ok) {
            alert('Город успешно создан!');
            this.reset();
            loadCities();
        } else {
            const error = await response.text();
            alert('Ошибка при создании города: ' + error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании города');
    }
});

// Обработчик редактирования города
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = formData.get('id');
    const name = formData.get('name');
    const countryId = formData.get('countryId');

    try {
        const response = await fetch(`/CitiesAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: parseInt(id),
                name: name,
                countryId: parseInt(countryId)
            })
        });

        if (response.ok) {
            alert('Город успешно обновлен!');
            this.reset();
            loadCities();
        } else {
            const error = await response.text();
            alert('Ошибка при обновлении города: ' + error);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении города');
    }
});

// Обработчик удаления города
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = formData.get('id');

    if (confirm('Вы уверены, что хотите удалить этот город?')) {
        try {
            const response = await fetch(`/CitiesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                })
            });

            if (response.ok) {
                alert('Город успешно удален!');
                this.reset();
                loadCities();
            } else {
                alert('Ошибка при удалении города');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении города');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteCity(id) {
    if (confirm('Вы уверены, что хотите удалить этот город?')) {
        try {
            const response = await fetch(`/CitiesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id),
                })
            });

            if (response.ok) {
                alert('Город успешно удален!');
                loadCities();
            } else {
                alert('Ошибка при удалении города');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении города');
        }
    }
}

// Загружаем страны и города при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    loadCountries();
    loadCities();
});