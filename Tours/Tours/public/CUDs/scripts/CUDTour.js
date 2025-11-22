// Переменные для хранения данных
let hotels = [];
let russiaCities = [];
let tours = [];

// Функция для загрузки отелей
async function loadHotels() {
    try {
        const response = await fetch('/HotelsAPI/all');
        hotels = await response.json();
        const hotelSelect = document.getElementById('hotelId');
        const editHotelSelect = document.getElementById('editHotelId');

        hotelSelect.innerHTML = '<option value="">Выберите отель</option>';
        editHotelSelect.innerHTML = '<option value="">Выберите отель</option>';

        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.Id;
            option.textContent = `${hotel.Name} (${hotel.CountStars || '?'}★)`;
            hotelSelect.appendChild(option);

            const editOption = document.createElement('option');
            editOption.value = hotel.Id;
            editOption.textContent = `${hotel.Name} (${hotel.CountStars || '?'}★)`;
            editHotelSelect.appendChild(editOption);
        });
    } catch (error) {
        console.error('Ошибка загрузки отелей:', error);
    }
}

// Функция для загрузки российских городов
async function loadRussiaCities() {
    try {
        const response = await fetch('/RussiaCitiesAPI/all');
        russiaCities = await response.json();
        const citySelect = document.getElementById('russiaCityId');
        const editCitySelect = document.getElementById('editRussiaCityId');

        citySelect.innerHTML = '<option value="">Выберите город вылета</option>';
        editCitySelect.innerHTML = '<option value="">Выберите город вылета</option>';

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

// Функция для загрузки туров
async function loadTours() {
    try {
        const response = await fetch('/ToursAPI/all');
        tours = await response.json();
        const tableBody = document.getElementById('toursTableBody');

        tableBody.innerHTML = '';
        tours.forEach(tour => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${tour.Id}</td>
                        <td>${formatDate(tour.DepartureDate)}</td>
                        <td>${tour.CountNight}</td>
                        <td>${formatPrice(tour.Price)}</td>
                        <td>${getHotelName(tour.HotelId)}</td>
                        <td>${tour.AdultCount}</td>
                        <td>${tour.ChildCount || 0}</td>
                        <td>${tour.IsHot ? '✅' : '❌'}</td>
                        <td>${getRussiaCityName(tour.RussiaCityId)}</td>
                        <td>
                            <button onclick="fillEditForm(${tour.Id})">Редактировать</button>
                            <button onclick="deleteTour(${tour.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
    }
}

// Вспомогательные функции для форматирования
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function formatPrice(price) {
    if (!price) return '-';
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
    }).format(price);
}

function getHotelName(hotelId) {
    const hotel = hotels.find(h => h.Id == hotelId);
    return hotel ? `${hotel.Name} (ID: ${hotel.Id})` : 'Неизвестно';
}

function getRussiaCityName(cityId) {
    const city = russiaCities.find(c => c.Id == cityId);
    return city ? city.Name : 'Неизвестно';
}

// Функция для заполнения формы редактирования
function fillEditForm(id) {
    const tour = tours.find(t => t.Id == id);
    if (tour) {
        document.getElementById('editId').value = tour.Id;
        document.getElementById('editDepartureDate').value = tour.DepartureDate ? tour.DepartureDate.split('T')[0] : '';
        document.getElementById('editCountNight').value = tour.CountNight;
        document.getElementById('editPrice').value = tour.Price;
        document.getElementById('editHotelId').value = tour.HotelId;
        document.getElementById('editAdultCount').value = tour.AdultCount;
        document.getElementById('editChildCount').value = tour.ChildCount || 0;
        document.getElementById('editIsHot').checked = tour.IsHot || false;
        document.getElementById('editRussiaCityId').value = tour.RussiaCityId;
    }
}

// Обработчик создания тура
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const tourData = {
        DepartureDate: formData.get('departureDate'),
        CountNight: parseInt(formData.get('countNight')),
        Price: parseFloat(formData.get('price')),
        HotelId: parseInt(formData.get('hotelId')),
        AdultCount: parseInt(formData.get('adultCount')),
        ChildCount: parseInt(formData.get('childCount')) || 0,
        IsHot: formData.get('isHot') === 'on',
        RussiaCityId: parseInt(formData.get('russiaCityId'))
    };

    try {
        const response = await fetch('/ToursAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Тур успешно создан!');
            this.reset();
            loadTours();
        } else {
            alert('Ошибка при создании тура');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании тура');
    }
});

// Обработчик редактирования тура
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const tourData = {
        Id: parseInt(formData.get('id')),
        DepartureDate: formData.get('departureDate'),
        CountNight: parseInt(formData.get('countNight')),
        Price: parseFloat(formData.get('price')),
        HotelId: parseInt(formData.get('hotelId')),
        AdultCount: parseInt(formData.get('adultCount')),
        ChildCount: parseInt(formData.get('childCount')) || 0,
        IsHot: formData.get('isHot') === 'on',
        RussiaCityId: parseInt(formData.get('russiaCityId'))
    };

    try {
        const response = await fetch(`/ToursAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Тур успешно обновлен!');
            this.reset();
            loadTours();
        } else {
            alert('Ошибка при обновлении тура');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении тура');
    }
});

// Обработчик удаления тура
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = formData.get('id');

    if (confirm('Вы уверены, что хотите удалить этот тур?')) {
        try {
            const response = await fetch(`/ToursAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(id) })
            });

            if (response.ok) {
                alert('Тур успешно удален!');
                this.reset();
                loadTours();
            } else {
                alert('Ошибка при удалении тура');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении тура');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteTour(id) {
    if (confirm('Вы уверены, что хотите удалить этот тур?')) {
        try {
            const response = await fetch(`/ToursAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(id) })
            });

            if (response.ok) {
                alert('Тур успешно удален!');
                loadTours();
            } else {
                alert('Ошибка при удалении тура');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении тура');
        }
    }
}

// Загружаем данные при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    loadHotels();
    loadRussiaCities();
    loadTours();
});