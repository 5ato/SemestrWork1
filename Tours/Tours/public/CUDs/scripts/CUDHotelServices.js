// Переменные для хранения данных
let currentServiceType = '';
let services = [];
let hotels = [];
let currentLinks = [];

// Функция для загрузки сервисов выбранного типа
async function loadServices() {
    currentServiceType = document.getElementById('serviceType').value;

    if (!currentServiceType) {
        document.getElementById('servicesSection').style.display = 'none';
        document.getElementById('hotelLinksSection').style.display = 'none';
        return;
    }

    document.getElementById('servicesSection').style.display = 'block';
    document.getElementById('sectionTitle').textContent = `Управление ${getServiceTypeName(currentServiceType)}`;

    try {
        const response = await fetch(`/HotelServicesAPI/GetServices?serviceName=${currentServiceType}`);
        services = await response.json();
        const tableBody = document.getElementById('servicesTableBody');
        const serviceSelect = document.getElementById('serviceIdForLink');

        // Обновляем таблицу
        tableBody.innerHTML = '';
        services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${service.Id}</td>
                        <td>${service.Type}</td>
                        <td>
                            <button onclick="fillEditForm(${service.Id}, '${service.Type}')">Редактировать</button>
                            <button onclick="deleteService(${service.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });

        // Обновляем выпадающий список для связей
        serviceSelect.innerHTML = '<option value="">Выберите сервис</option>';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.Id;
            option.textContent = service.Type;
            serviceSelect.appendChild(option);
        });

        // Загружаем отели и связи
        await loadHotels();
        await loadHotelLinks();

    } catch (error) {
        console.error('Ошибка загрузки сервисов:', error);
    }
}

// Функция для получения читаемого названия типа сервиса
function getServiceTypeName(serviceType) {
    const names = {
        'FreeServices': 'бесплатными услугами',
        'Beaches': 'пляжами',
        'PaidServices': 'платными услугами',
        'Territories': 'территориями',
        'InRooms': 'услугами в номере'
    };
    return names[serviceType] || serviceType;
}

// Функция для получения имени таблицы связей
function getLinkTableName(serviceType) {
    const linkTables = {
        'FreeServices': 'hotelfreeservice',
        'Beaches': 'hotelbeach',
        'PaidServices': 'hotelpaidservice',
        'Territories': 'hotelterritory',
        'InRooms': 'hotelinroom'
    };
    return linkTables[serviceType];
}

// Функция для получения имени поля ID сервиса в таблице связей
function getServiceIdFieldName(serviceType) {
    const fieldNames = {
        'FreeServices': 'freeserviceid',
        'Beaches': 'beachid',
        'PaidServices': 'paidserviceid', // Обратите внимание на опечатку в названии таблицы
        'Territories': 'territoryid',
        'InRooms': 'inroomid'
    };
    return fieldNames[serviceType];
}

// Функция для загрузки отелей
async function loadHotels() {
    try {
        const response = await fetch('/HotelsAPI/all');
        hotels = await response.json();
        const hotelSelect = document.getElementById('hotelId');

        hotelSelect.innerHTML = '<option value="">Выберите отель</option>';
        hotels.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.Id;
            option.textContent = `${hotel.Name} (${hotel.CountStars || '?'}★)`;
            hotelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Ошибка загрузки отелей:', error);
    }
}

// Функция для загрузки связей отелей с сервисами
async function loadHotelLinks() {
    if (!currentServiceType) return;

    try {
        const linkTable = getLinkTableName(currentServiceType);
        const response = await fetch(`/HotelServicesAPI/GetHotelService?hotelServiceName=${linkTable}`);
        currentLinks = await response.json();
        const tableBody = document.getElementById('linksTableBody');

        tableBody.innerHTML = '';
        currentLinks.forEach(link => {
            const hotel = hotels.find(h => h.Id == link.HotelId);
            const service = services.find(s => s.Id == link["ServiceId"]);

            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${link.HotelId}</td>
                        <td>${hotel ? hotel.Name : 'Неизвестно'}</td>
                        <td>${service ? service.Id : 'Неизвестно'}</td>
                        <td>${service ? service.Type : 'Неизвестно'}</td>
                        <td>
                            <button onclick="removeHotelLink(${link.HotelId}, ${link["ServiceId"]})">Удалить связь</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });

        // Показываем раздел связей
        document.getElementById('hotelLinksSection').style.display = 'block';
    } catch (error) {
        console.error('Ошибка загрузки связей:', error);
    }
}

// Функция для заполнения формы редактирования
function fillEditForm(id, name) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
}

// Обработчик создания сервиса
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');

    try {
        const response = await fetch(`/HotelServicesAPI/CreateService`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: name, serviceName: currentServiceType })
        });

        if (response.ok) {
            alert('Сервис успешно создан!');
            this.reset();
            loadServices();
        } else {
            alert('Ошибка при создании сервиса');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании сервиса');
    }
});

// Обработчик редактирования сервиса
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = parseInt(formData.get('id'));
    const name = formData.get('name');

    try {
        const response = await fetch(`/HotelServicesAPI/UpdateService`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: name, serviceName: currentServiceType, id: id })
        });

        if (response.ok) {
            alert('Сервис успешно обновлен!');
            this.reset();
            loadServices();
        } else {
            alert('Ошибка при обновлении сервиса');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении сервиса');
    }
});

// Обработчик удаления сервиса
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = parseInt(formData.get('id'));

    if (confirm('Вы уверены, что хотите удалить этот сервис?')) {
        try {
            const response = await fetch(`/HotelServicesAPI/DeleteService`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serviceName: currentServiceType, id: id })
            });

            if (response.ok) {
                alert('Сервис успешно удален!');
                this.reset();
                loadServices();
            } else {
                alert('Ошибка при удалении сервиса');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении сервиса');
        }
    }
});

// Обработчик добавления связи с отелем
document.getElementById('addLinkForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const hotelId = formData.get('hotelId');
    const serviceId = formData.get('serviceId');

    try {
        const linkTable = getLinkTableName(currentServiceType);
        const response = await fetch(`/HotelServicesAPI/CreateHotelService`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hotelId: parseInt(hotelId),
                serviceId: parseInt(serviceId),
                tableName: linkTable
            })
        });

        if (response.ok) {
            alert('Связь успешно добавлена!');
            this.reset();
            loadHotelLinks();
        } else {
            alert('Ошибка при добавлении связи');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при добавлении связи');
    }
});

// Обработчик удаления связи с отелем
document.getElementById('removeLinkForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const hotelId = formData.get('hotelId');
    const serviceId = formData.get('serviceId');

    if (confirm('Вы уверены, что хотите удалить эту связь?')) {
        try {
            const linkTable = getLinkTableName(currentServiceType);
            const response = await fetch(`/HotelServicesAPI/DeleteHotelService`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hotelId: parseInt(hotelId),
                    serviceId: parseInt(serviceId),
                    tableName: linkTable
                })
            });

            if (response.ok) {
                alert('Связь успешно удалена!');
                this.reset();
                loadHotelLinks();
            } else {
                alert('Ошибка при удалении связи');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении связи');
        }
    }
});

// Функции для быстрого удаления
async function deleteService(id) {
    if (confirm('Вы уверены, что хотите удалить этот сервис?')) {
        try {
            const response = await fetch(`/HotelServicesAPI/DeleteService`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serviceName: currentServiceType, id: parseInt(id) })
            });

            if (response.ok) {
                alert('Сервис успешно удален!');
                loadServices();
            } else {
                alert('Ошибка при удалении сервиса');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении сервиса');
        }
    }
}

async function removeHotelLink(hotelId, serviceId) {
    if (confirm('Вы уверены, что хотите удалить эту связь?')) {
        try {
            const linkTable = getLinkTableName(currentServiceType);
            const response = await fetch(`/HotelServicesAPI/DeleteHotelService`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hotelId: parseInt(hotelId),
                    serviceId: parseInt(serviceId),
                    tableName: linkTable
                })
            });

            if (response.ok) {
                alert('Связь успешно удалена!');
                loadHotelLinks();
            } else {
                alert('Ошибка при удалении связи');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении связи');
        }
    }
}

// Загружаем отели при загрузке страницы
document.addEventListener('DOMContentLoaded', loadHotels);