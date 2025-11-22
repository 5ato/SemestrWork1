// Переменные для хранения данных
let nutritions = [];
let cities = [];
let hotelTypes = [];
let hotels = [];

// Функция для загрузки типов питания
async function loadNutritions() {
    try {
        const response = await fetch('/NutritionsAPI/all');
        nutritions = await response.json();
        const nutritionSelect = document.getElementById('nutritionId');
        const editNutritionSelect = document.getElementById('editNutritionId');

        nutritionSelect.innerHTML = '<option value="">Выберите тип питания</option>';
        editNutritionSelect.innerHTML = '<option value="">Выберите тип питания</option>';

        nutritions.forEach(nutrition => {
            const option = document.createElement('option');
            option.value = nutrition.Id;
            option.textContent = nutrition.Name;
            nutritionSelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = nutrition.Id;
            editOption.textContent = nutrition.Name;
            editNutritionSelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки типов питания:', error);
    }
}

// Функция для загрузки городов
async function loadCities() {
    try {
        const response = await fetch('/CitiesAPI/all');
        cities = await response.json();
        const citySelect = document.getElementById('cityId');
        const editCitySelect = document.getElementById('editCityId');

        citySelect.innerHTML = '<option value="">Выберите город</option>';
        editCitySelect.innerHTML = '<option value="">Выберите город</option>';

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.Id;
            option.textContent = `${city.Name} (ID страны: ${city.CountryId})`;
            citySelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = city.Id;
            editOption.textContent = `${city.Name} (ID страны: ${city.CountryId})`;
            editCitySelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки городов:', error);
    }
}

// Функция для загрузки типов отелей
async function loadHotelTypes() {
    try {
        const response = await fetch('/HotelTypesAPI/all');
        hotelTypes = await response.json();
        const hotelTypeSelect = document.getElementById('hotelTypeId');
        const editHotelTypeSelect = document.getElementById('editHotelTypeId');

        hotelTypeSelect.innerHTML = '<option value="">Выберите тип отеля</option>';
        editHotelTypeSelect.innerHTML = '<option value="">Выберите тип отеля</option>';

        hotelTypes.forEach(hotelType => {
            const option = document.createElement('option');
            option.value = hotelType.Id;
            option.textContent = hotelType.Name;
            hotelTypeSelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = hotelType.Id;
            editOption.textContent = hotelType.Name;
            editHotelTypeSelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки типов отелей:', error);
    }
}

// Функция для загрузки отелей
async function loadHotels() {
    try {
        const response = await fetch('/HotelsAPI/all');
        hotels = await response.json();
        const tableBody = document.getElementById('hotelsTableBody');

        tableBody.innerHTML = '';
        hotels.forEach(hotel => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${hotel.Id}</td>
                        <td>${hotel.Name}</td>
                        <td>${hotel.FoundedYear || '-'}</td>
                        <td>${getNutritionName(hotel.NutritionId)}</td>
                        <td>${hotel.Address || '-'}</td>
                        <td>${hotel.CountStars || '-'}</td>
                        <td>${getCityName(hotel.CityId)}</td>
                        <td>${getHotelTypeName(hotel.HotelTypeId)}</td>
                        <td>
                            <button onclick="fillEditForm(${hotel.Id})">Редактировать</button>
                            <button onclick="deleteHotel(${hotel.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки отелей:', error);
    }
}

// Вспомогательные функции для получения названий
function getNutritionName(nutritionId) {
    const nutrition = nutritions.find(n => n.Id == nutritionId);
    return nutrition ? nutrition.Name : 'Неизвестно';
}

function getCityName(cityId) {
    const city = cities.find(c => c.Id == cityId);
    return city ? city.Name : 'Неизвестно';
}

function getHotelTypeName(hotelTypeId) {
    const hotelType = hotelTypes.find(h => h.Id == hotelTypeId);
    return hotelType ? hotelType.Name : 'Неизвестно';
}

// Функция для заполнения формы редактирования
function fillEditForm(id) {
    const hotel = hotels.find(h => h.Id == id);
    if (hotel) {
        document.getElementById('editId').value = hotel.Id;
        document.getElementById('editName').value = hotel.Name || '';
        document.getElementById('editRoomDescription').value = hotel.RoomDescription || '';
        document.getElementById('editFoundedYear').value = hotel.FoundedYear || '';
        document.getElementById('editNutritionId').value = hotel.NutritionId || '';
        document.getElementById('editLocationDescription').value = hotel.LocationDescription || '';
        document.getElementById('editAddress').value = hotel.Address || '';
        document.getElementById('editCountStars').value = hotel.CountStars || '';
        document.getElementById('editCityId').value = hotel.CityId || '';
        document.getElementById('editHotelTypeId').value = hotel.HotelTypeId || '';
        document.getElementById('editDescription').value = hotel.Description || '';
    }
}

// Обработчик создания отеля
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const hotelData = {
        Name: formData.get('name'),
        RoomDescription: formData.get('roomDescription'),
        FoundedYear: formData.get('foundedYear') ? parseInt(formData.get('foundedYear')) : null,
        NutritionId: parseInt(formData.get('nutritionId')),
        LocationDescription: formData.get('locationDescription'),
        Address: formData.get('address'),
        CountStars: formData.get('countStars') ? parseInt(formData.get('countStars')) : null,
        CityId: parseInt(formData.get('cityId')),
        HotelTypeId: parseInt(formData.get('hotelTypeId')),
        Description: formData.get('description')
    };

    try {
        const response = await fetch('/HotelsAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hotelData)
        });

        if (response.ok) {
            alert('Отель успешно создан!');
            this.reset();
            loadHotels();
        } else {
            alert('Ошибка при создании отеля');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании отеля');
    }
});

// Обработчик редактирования отеля
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const hotelData = {
        Id: parseInt(formData.get('id')),
        Name: formData.get('name'),
        RoomDescription: formData.get('roomDescription'),
        FoundedYear: formData.get('foundedYear') ? parseInt(formData.get('foundedYear')) : null,
        NutritionId: parseInt(formData.get('nutritionId')),
        LocationDescription: formData.get('locationDescription'),
        Address: formData.get('address'),
        CountStars: formData.get('countStars') ? parseInt(formData.get('countStars')) : null,
        CityId: parseInt(formData.get('cityId')),
        HotelTypeId: parseInt(formData.get('hotelTypeId')),
        Description: formData.get('description')
    };

    try {
        const response = await fetch(`/HotelsAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hotelData)
        });

        if (response.ok) {
            alert('Отель успешно обновлен!');
            this.reset();
            loadHotels();
        } else {
            alert('Ошибка при обновлении отеля');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении отеля');
    }
});

// Обработчик удаления отеля
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = formData.get('id');

    if (confirm('Вы уверены, что хотите удалить этот отель?')) {
        try {
            const response = await fetch(`/HotelsAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(id) })
            });

            if (response.ok) {
                alert('Отель успешно удален!');
                this.reset();
                loadHotels();
            } else {
                alert('Ошибка при удалении отеля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении отеля');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteHotel(id) {
    if (confirm('Вы уверены, что хотите удалить этот отель?')) {
        try {
            const response = await fetch(`/HotelsAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(id) })
            });

            if (response.ok) {
                alert('Отель успешно удален!');
                loadHotels();
            } else {
                alert('Ошибка при удалении отеля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении отеля');
        }
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    loadNutritions();
    loadCities();
    loadHotelTypes();
    loadHotels();
});