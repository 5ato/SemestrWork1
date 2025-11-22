// Функция для загрузки списка стран
async function loadCountries() {
    try {
        const response = await fetch('/CountriesAPI/all');
        const countries = await response.json();
        const tableBody = document.getElementById('countriesTableBody');

        tableBody.innerHTML = '';
        countries.forEach(country => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>` + country.Id.toString() + `</td>
                        <td>` + country.Name + `</td>
                        <td>
                            <button onclick="fillEditForm(` + country.Id.toString() + `, '` + country.Name + `')">Редактировать</button>
                            <button onclick="deleteCountry(` + country.Id.toString() + `)">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки стран:', error);
    }
}

// Функция для заполнения формы редактирования
function fillEditForm(id, name) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
}

// Обработчик создания страны
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');

    try {
        const response = await fetch('/CountriesAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            alert('Страна успешно создана!');
            this.reset();
            loadCountries();
        } else {
            alert('Ошибка при создании страны');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании страны');
    }
});

// Обработчик редактирования страны
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));
    const name = formData.get('name');

    try {
        const response = await fetch(`/CountriesAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name })
        });

        if (response.ok) {
            alert('Страна успешно обновлена!');
            this.reset();
            loadCountries();
        } else {
            alert('Ошибка при обновлении страны');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении страны');
    }
});

// Обработчик удаления страны
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));

    if (confirm('Вы уверены, что хотите удалить эту страну?')) {
        try {
            const response = await fetch(`/CountriesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Страна успешно удалена!');
                this.reset();
                loadCountries();
            } else {
                alert('Ошибка при удалении страны');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении страны');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteCountry(id) {
    id = Number(id);
    if (confirm('Вы уверены, что хотите удалить эту страну?')) {
        try {
            const response = await fetch(`/CountriesAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Страна успешно удалена!');
                loadCountries();
            } else {
                alert('Ошибка при удалении страны');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении страны');
        }
    }
}

// Загружаем страны при загрузке страницы
document.addEventListener('DOMContentLoaded', loadCountries);