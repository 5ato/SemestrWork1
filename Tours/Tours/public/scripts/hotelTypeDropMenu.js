let hotelTypes;

// Массив с типами отелей (в дальнейшем будет загружаться с сервера)
document.addEventListener('DOMContentLoaded', async () => {
    hotelTypes = await fetch('/HotelTypesAPI/all').then(response => response.json());
    initHotelTypeMenu();
})

// Массив для хранения выбранных типов
let selectedHotelTypes = [];

// Функция для создания выпадающего меню
function createHotelTypeDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'type-dropdown';
    dropdown.id = 'hotelTypeDropdown';

    // Создаем элементы для каждого типа отеля
    hotelTypes.forEach(hotelType => {
        const typeItem = document.createElement('div');
        typeItem.className = 'type-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `type-${hotelType.Id}`;
        checkbox.value = hotelType.Id;

        // Обработчик изменения checkbox
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedHotelTypes.push(hotelType.Id);
            } else {
                selectedHotelTypes = selectedHotelTypes.filter(Id => Id != hotelType.Id);
            }
            const errorHotelType = document.getElementById('searchHotelErrorHotelType');
            errorHotelType.classList.remove('displayError');
        });

        const label = document.createElement('label');
        label.htmlFor = `type-${hotelType.Id}`;
        label.textContent = hotelType.Name;

        typeItem.appendChild(checkbox);
        typeItem.appendChild(label);
        dropdown.appendChild(typeItem);
    });

    return dropdown;
}

// Функция для инициализации меню типов отелей
function initHotelTypeMenu() {
    const hotelTypeElement = document.getElementById('HotelType');
    const dropdown = createHotelTypeDropdown();

    // Добавляем меню в DOM
    hotelTypeElement.appendChild(dropdown);

    // Обработчик клика по блоку "Тип отеля"
    hotelTypeElement.addEventListener('click', function (event) {
        if (event.target.closest('.HotelType p')) {
            dropdown.classList.toggle('show');
            hotelTypeElement.classList.toggle('active');
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.HotelType')) {
            dropdown.classList.remove('show');
            hotelTypeElement.classList.remove('active');
        }
    });
}

// Функции для работы с меню извне

// Получить выбранные типы отелей
function getSelectedHotelTypes() {
    return selectedHotelTypes;
}

// Установить выбранные типы отелей
function setSelectedHotelTypes(types) {
    selectedHotelTypes = types;

    // Сбрасываем все checkbox
    const checkboxes = document.querySelectorAll('#hotelTypeDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Устанавливаем выбранные типы
    types.forEach(type => {
        const checkbox = document.getElementById(`type-${type.id}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
}

// Сбросить выбранные типы
function resetSelectedHotelTypes() {
    selectedHotelTypes = [];
    const checkboxes = document.querySelectorAll('#hotelTypeDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Обновить список типов отелей с сервера
function updateHotelTypesFromServer(newTypes) {
    // Пример реализации для работы с сервером:
    /*
    fetch('/api/hotel-types')
        .then(response => response.json())
        .then(data => {
            hotelTypes.length = 0; // Очищаем массив
            hotelTypes.push(...data); // Заполняем новыми данными

            // Пересоздаем меню
            const oldDropdown = document.getElementById('hotelTypeDropdown');
            if (oldDropdown) {
                oldDropdown.remove();
            }

            const newDropdown = createHotelTypeDropdown();
            document.getElementById('HotelType').appendChild(newDropdown);
        })
        .catch(error => {
            console.error('Ошибка загрузки типов отелей:', error);
        });
    */

    // Для демонстрации используем переданные данные
    hotelTypes.length = 0;
    hotelTypes.push(...newTypes);

    const oldDropdown = document.getElementById('hotelTypeDropdown');
    if (oldDropdown) {
        oldDropdown.remove();
    }

    const newDropdown = createHotelTypeDropdown();
    document.getElementById('HotelType').appendChild(newDropdown);
}

// Пример использования функций:
/*
// Получить выбранные типы
const selected = getSelectedHotelTypes();
console.log(selected);

// Установить выбранные типы
setSelectedHotelTypes([
    { id: "hotel", name: "Отель" },
    { id: "villa", name: "Вилла" }
]);

// Сбросить выбор
resetSelectedHotelTypes();

// Обновить данные с сервера
updateHotelTypesFromServer([
    { id: "new1", name: "Новый тип 1" },
    { id: "new2", name: "Новый тип 2" }
]);
*/