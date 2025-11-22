// Массив с типами питания (в дальнейшем будет загружаться с сервера)
let nutritionTypes;

document.addEventListener('DOMContentLoaded', async () => {
    nutritionTypes = await fetch('/NutritionsAPI/all').then(response => response.json());
    nutritionTypes.push({ Id: -1, Name: "Любое" });

    initNutritionMenu();
});

// Переменная для хранения выбранного типа питания
let selectedNutrition = { Id: -1, Name: "Любое" };

// Функция для создания выпадающего меню
function createNutritionDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'nutrition-dropdown';
    dropdown.id = 'nutritionDropdown';

    // Создаем элементы для каждого типа питания
    nutritionTypes.forEach(nutritionType => {
        const nutritionItem = document.createElement('div');
        nutritionItem.className = 'nutrition-item';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'nutrition';
        radio.id = `nutrition-${nutritionType.Id}`;
        radio.value = nutritionType.Id;

        // Устанавливаем "Любое" по умолчанию
        if (nutritionType.Id === "") {
            radio.checked = true;
        }

        // Обработчик изменения radio
        radio.addEventListener('change', function () {
            if (this.checked) {
                selectedNutrition = {
                    Id: nutritionType.Id,
                    Name: nutritionType.Name
                };
                updateSelectedNutritionDisplay();
                console.log('Выбранный тип питания:', selectedNutrition);
            }
        });

        const label = document.createElement('label');
        label.htmlFor = `nutrition-${nutritionType.Id}`;
        label.textContent = nutritionType.Name;

        nutritionItem.appendChild(radio);
        nutritionItem.appendChild(label);
        dropdown.appendChild(nutritionItem);
    });

    return dropdown;
}

// Функция для обновления отображения выбранного типа питания
function updateSelectedNutritionDisplay() {
    const nutritionElement = document.getElementById('HotelNutrition');
    let selectedDisplay = nutritionElement.querySelector('.selected-nutrition');

    if (!selectedDisplay) {
        selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'selected-nutrition';
        nutritionElement.appendChild(selectedDisplay);
    }

    selectedDisplay.textContent = selectedNutrition.Name;
}

// Функция для инициализации меню питания
function initNutritionMenu() {
    const nutritionElement = document.getElementById('HotelNutrition');
    const dropdown = createNutritionDropdown();

    // Добавляем меню в DOM
    nutritionElement.appendChild(dropdown);

    // Обработчик клика по блоку "Питание"
    nutritionElement.addEventListener('click', function (event) {
        if (event.target.closest('.HotelNutrition p')) {
            dropdown.classList.toggle('show');
            nutritionElement.classList.toggle('active');
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.HotelNutrition')) {
            dropdown.classList.remove('show');
            nutritionElement.classList.remove('active');
        }
    });

    // Инициализируем отображение выбранного типа
    updateSelectedNutritionDisplay();
}

// Установить выбранный тип питания
function setSelectedNutrition(nutritionId) {
    const nutritionType = nutritionTypes.find(type => type.Id === nutritionId);
    if (nutritionType) {
        selectedNutrition = nutritionType;

        // Устанавливаем соответствующий radio
        const radio = document.getElementById(`nutrition-${nutritionId}`);
        if (radio) {
            radio.checked = true;
        }

        updateSelectedNutritionDisplay();
    }
}

// Сбросить выбор к "Любое"
function resetSelectedNutrition() {
    selectedNutrition = { Id: "any", Name: "Любое" };
    const radio = document.getElementById('nutrition-any');
    if (radio) {
        radio.checked = true;
    }
    updateSelectedNutritionDisplay();
}
