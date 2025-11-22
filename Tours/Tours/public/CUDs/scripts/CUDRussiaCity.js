// Переменные для хранения данных
let russiaCities = [];
let countries = [];
let travelRoutes = [];

// Функция для загрузки российских городов
async function loadRussiaCities() {
    try {
        const response = await fetch('/RussiaCitiesAPI/all');
        russiaCities = await response.json();
        const tableBody = document.getElementById('russiaCitiesTableBody');
        const citySelect = document.getElementById('russiaCityId');
        const editCitySelect = document.getElementById('editNewRussiaCityId');

        // Обновляем таблицу
        tableBody.innerHTML = '';
        russiaCities.forEach(city => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${city.Id}</td>
                        <td>${city.Name}</td>
                        <td>
                            <button onclick="fillEditCityForm(${city.Id}, '${city.Name}')">Редактировать</button>
                            <button onclick="deleteRussiaCity(${city.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });

        // Обновляем выпадающие списки
        citySelect.innerHTML = '<option value="">Выберите город</option>';
        editCitySelect.innerHTML = '<option value="">Выберите город</option>';
        russiaCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.Id;
            option.textContent = city.Name;
            citySelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = city.Id;
            editOption.textContent = city.Name;
            editCitySelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки российских городов:', error);
    }
}

// Функция для загрузки стран
async function loadCountries() {
    try {
        const response = await fetch('/CountriesAPI/all');
        countries = await response.json();
        const countrySelect = document.getElementById('countryId');
        const editCountrySelect = document.getElementById('editNewCountryId');

        countrySelect.innerHTML = '<option value="">Выберите страну</option>';
        editCountrySelect.innerHTML = '<option value="">Выберите страну</option>';
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

// Функция для загрузки маршрутов
async function loadTravelRoutes() {
    try {
        const response = await fetch('/TravelRoutesAPI/all');
        travelRoutes = await response.json();
        const tableBody = document.getElementById('routesTableBody');

        tableBody.innerHTML = '';
        travelRoutes.forEach(route => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${route.RussiaCityId}</td>
                        <td>${getRussiaCityName(route.RussiaCityId)}</td>
                        <td>${route.CountryId}</td>
                        <td>${getCountryName(route.CountryId)}</td>
                        <td>
                            <button onclick="fillEditRouteForm(${route.RussiaCityId}, ${route.CountryId})">Редактировать</button>
                            <button onclick="deleteTravelRoute(${route.RussiaCityId}, ${route.CountryId})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки маршрутов:', error);
    }
}

// Вспомогательные функции для получения названий
function getRussiaCityName(cityId) {
    const city = russiaCities.find(c => c.Id == cityId);
    return city ? city.Name : 'Неизвестно';
}

function getCountryName(countryId) {
    const country = countries.find(c => c.Id == countryId);
    return country ? country.Name : 'Неизвестно';
}

// Функция для заполнения формы редактирования города
function fillEditCityForm(id, name) {
    document.getElementById('editCityId').value = id;
    document.getElementById('editCityName').value = name;
}

// Функция для заполнения формы редактирования маршрута
function fillEditRouteForm(russiaCityId, countryId) {
    document.getElementById('editOldRussiaCityId').value = russiaCityId;
    document.getElementById('editOldCountryId').value = countryId;
    document.getElementById('editNewRussiaCityId').value = russiaCityId;
    document.getElementById('editNewCountryId').value = countryId;
}

// Обработчик создания российского города
document.getElementById('createCityForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');

    try {
        const response = await fetch('/RussiaCitiesAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            alert('Российский город успешно создан!');
            this.reset();
            loadRussiaCities();
        } else {
            alert('Ошибка при создании города');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании города');
    }
});

// Обработчик редактирования российского города
document.getElementById('editCityForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));
    const name = formData.get('name');

    try {
        const response = await fetch(`/RussiaCitiesAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name })
        });

        if (response.ok) {
            alert('Город успешно обновлен!');
            this.reset();
            loadRussiaCities();
            loadTravelRoutes();
        } else {
            alert('Ошибка при обновлении города');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении города');
    }
});

// Обработчик создания маршрута
document.getElementById('createRouteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const russiaCityId = formData.get('russiaCityId');
    const countryId = formData.get('countryId');

    try {
        const response = await fetch('/TravelRoutesAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                russiaCityId: parseInt(russiaCityId),
                countryId: parseInt(countryId)
            })
        });

        if (response.ok) {
            alert('Маршрут успешно создан!');
            this.reset();
            loadTravelRoutes();
        } else {
            alert('Ошибка при создании маршрута');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании маршрута');
    }
});

// Обработчик редактирования маршрута
document.getElementById('editRouteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const oldRussiaCityId = formData.get('oldRussiaCityId');
    const oldCountryId = formData.get('oldCountryId');
    const newRussiaCityId = formData.get('newRussiaCityId');
    const newCountryId = formData.get('newCountryId');

    try {
        const response = await fetch(`/TravelRoutesAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldRussiaCityId: parseInt(oldRussiaCityId),
                oldCountryId: parseInt(oldCountryId),
                newRussiaCityId: parseInt(newRussiaCityId),
                newCountryId: parseInt(newCountryId)
            })
        });

        if (response.ok) {
            alert('Маршрут успешно обновлен!');
            this.reset();
            loadTravelRoutes();
        } else {
            alert('Ошибка при обновлении маршрута');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении маршрута');
    }
});

// Обработчик удаления российского города
document.getElementById('deleteCityForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));

    if (confirm('Вы уверены, что хотите удалить этот город?')) {
        try {
            const response = await fetch(`/RussiaCitiesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Город успешно удален!');
                this.reset();
                loadRussiaCities();
                loadTravelRoutes();
            } else {
                alert('Ошибка при удалении города');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении города');
        }
    }
});

// Обработчик удаления маршрута
document.getElementById('deleteRouteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const russiaCityId = formData.get('russiaCityId');
    const countryId = formData.get('countryId');

    if (confirm('Вы уверены, что хотите удалить этот маршрут?')) {
        try {
            const response = await fetch(`/TravelRoutesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ russiaCityId: parseInt(russiaCityId), countryId: parseInt(countryId) })
            });

            if (response.ok) {
                alert('Маршрут успешно удален!');
                this.reset();
                loadTravelRoutes();
            } else {
                alert('Ошибка при удалении маршрута');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении маршрута');
        }
    }
});

// Функции для быстрого удаления
async function deleteRussiaCity(id) {
    if (confirm('Вы уверены, что хотите удалить этот город?')) {
        try {
            const response = await fetch(`/RussiaCitiesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Город успешно удален!');
                loadRussiaCities();
                loadTravelRoutes();
            } else {
                alert('Ошибка при удалении города');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении города');
        }
    }
}

async function deleteTravelRoute(russiaCityId, countryId) {
    if (confirm('Вы уверены, что хотите удалить этот маршрут?')) {
        try {
            const response = await fetch(`/TravelRoutesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ russiaCityId: parseInt(russiaCityId), countryId: parseInt(countryId) })
            });

            if (response.ok) {
                alert('Маршрут успешно удален!');
                loadTravelRoutes();
            } else {
                alert('Ошибка при удалении маршрута');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении маршрута');
        }
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    loadRussiaCities();
    loadCountries();
    loadTravelRoutes();
});