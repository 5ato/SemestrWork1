// Функция для загрузки списка питаний
async function loadNutritions() {
    try {
        const response = await fetch('/NutritionsAPI/all');
        const nutritions = await response.json();
        const tableBody = document.getElementById('nutritionsTableBody');

        tableBody.innerHTML = '';
        nutritions.forEach(nutrition => {
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>` + nutrition.Id + `</td>
                        <td>` + nutrition.Name + `</td>
                        <td>
                            <button onclick="fillEditForm(` + nutrition.Id + `, '` + nutrition.Name + `')">Редактировать</button>
                            <button onclick="deleteNutrition(` + nutrition.Id + `)">Удалить</button>
                        </td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка загрузки питаний:', error);
    }
}

// Функция для заполнения формы редактирования
function fillEditForm(id, name) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
}

// Обработчик создания питания
document.getElementById('createForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name');

    try {
        const response = await fetch('/NutritionsAPI/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            alert('Питание успешно создано!');
            this.reset();
            loadNutritions();
        } else {
            alert('Ошибка при создании питания');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании питания');
    }
});

// Обработчик редактирования питания
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));
    const name = formData.get('name');

    try {
        const response = await fetch(`/NutritionsAPI/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name })
        });

        if (response.ok) {
            alert('Питание успешно обновлено!');
            this.reset();
            loadNutritions();
        } else {
            alert('Ошибка при обновлении питания');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при обновлении питания');
    }
});

// Обработчик удаления питания
document.getElementById('deleteForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const id = Number(formData.get('id'));

    if (confirm('Вы уверены, что хотите удалить это питание?')) {
        try {
            const response = await fetch(`/NutritionsAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Питание успешно удалено!');
                this.reset();
                loadNutritions();
            } else {
                alert('Ошибка при удалении питания');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении питания');
        }
    }
});

// Функция для быстрого удаления из таблицы
async function deleteNutrition(id) {
    id = Number(id);
    if (confirm('Вы уверены, что хотите удалить это питание?')) {
        try {
            const response = await fetch(`/NutritionsAPI/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                alert('Питание успешно удалено!');
                loadNutritions();
            } else {
                alert('Ошибка при удалении питания');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении питания');
        }
    }
}

// Загружаем питания при загрузке страницы
document.addEventListener('DOMContentLoaded', loadNutritions);