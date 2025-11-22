// Функция для загрузки списка типов отелей
async function loadHotelTypes() {
    try {
        const response = await fetch('/HotelTypesAPI/all');
        const hotelTypes = await response.json();
        const tableBody = document.getElementById('hotelTypesTableBody');

        tableBody.innerHTML = '';
        hotelTypes.forEach(hotelType => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${hotelType.Id}</td>
                        <td>${hotelType.Name}</td>
                        <td>
                            <button onclick="fillEditForm(${hotelType.Id}, '${hotelType.Name}')">Редактировать</button>
                            <button onclick="deleteHotelType(${hotelType.Id})">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки типов отелей:', error);
    }
}

// Функция для заполнения формы редактирования
function fillEditForm(id, name) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
}

// Обработчик создания типа отеля
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');

    try {
        const response = await fetch('/HotelTypesAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            alert('Тип отеля успешно создан!');
            this.reset();
            loadHotelTypes();
        } else {
            alert('Ошибка при создании типа отеля');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании типа отеля');
    }
});

// Обработчик редактирования типа отеля
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));
    const name = formData.get('name');

    try {
        const response = await fetch(`/HotelTypesAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name })
        });

        if (response.ok) {
            alert('Тип отеля успешно обновлен!');
            this.reset();
            loadHotelTypes();
        } else {
            alert('Ошибка при обновлении типа отеля');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении типа отеля');
    }
});

// Обработчик удаления типа отеля
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));

    if (confirm('Вы уверены, что хотите удалить этот тип отеля?')) {
        try {
            const response = await fetch(`/HotelTypesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Тип отеля успешно удален!');
                this.reset();
                loadHotelTypes();
            } else {
                alert('Ошибка при удалении типа отеля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении типа отеля');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteHotelType(id) {
    if (confirm('Вы уверены, что хотите удалить этот тип отеля?')) {
        try {
            const response = await fetch(`/HotelTypesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: parseInt(id) })
            });

            if (response.ok) {
                alert('Тип отеля успешно удален!');
                loadHotelTypes();
            } else {
                alert('Ошибка при удалении типа отеля');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении типа отеля');
        }
    }
}

// Загружаем типы отелей при загрузке страницы
document.addEventListener('DOMContentLoaded', loadHotelTypes);