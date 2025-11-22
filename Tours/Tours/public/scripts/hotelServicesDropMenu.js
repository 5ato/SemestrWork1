// Массив с данными о группах услуг
let hotelServices;

document.addEventListener('DOMContentLoaded', async () => {
    hotelServices = await fetch("/HotelServicesAPI/grouped").then(response => response.json());
    initHotelServicesMenu();
});


// Объект для хранения выбранных услуг
let selectedServices = [];

// Функция для создания выпадающего меню
function createDropdownMenu() {
    const dropdown = document.createElement('div');
    dropdown.className = 'HotelServices-dropdown-menu';
    dropdown.id = 'servicesDropdown';

    Object.keys(hotelServices).forEach(groupData => {
        // Создаем группу
        const groupDiv = document.createElement('div');
        groupDiv.className = 'service-group';

        // Заголовок группы
        const header = document.createElement('div');
        header.className = 'group-header';

        const headerText = document.createElement('span');
        headerText.textContent = groupData;

        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '▼';

        header.appendChild(headerText);
        header.appendChild(arrow);

        // Контент группы
        const content = document.createElement('div');
        content.className = 'group-content';

        hotelServices[groupData].forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = service.Id;
            checkbox.value = service.Id;

            checkbox.addEventListener('change', function () {
                if (this.checked) {
                    selectedServices.push({
                        'Id': service.Id,
                        'TableName': groupData,
                    });
                } else {
                    selectedServices = selectedServices.filter((s) => (s.Id != service.Id) || (s.TableName != groupData));
                }
            });

            const label = document.createElement('label');
            label.htmlFor = service.Id;
            label.textContent = service.Type;

            serviceItem.appendChild(checkbox);
            serviceItem.appendChild(label);
            content.appendChild(serviceItem);
        });

        // Обработчик клика по заголовку группы
        header.addEventListener('click', function () {
            content.classList.toggle('expanded');
            arrow.classList.toggle('expanded');
        });

        groupDiv.appendChild(header);
        groupDiv.appendChild(content);
        dropdown.appendChild(groupDiv);
    });

    return dropdown;
}

// Функция для инициализации меню
function initHotelServicesMenu() {
    const hotelServicesElement = document.getElementById('HotelServices');
    const dropdown = createDropdownMenu();

    // Добавляем меню в DOM
    hotelServicesElement.appendChild(dropdown);

    // Обработчик клика по блоку услуг
    hotelServicesElement.addEventListener('click', function (event) {
        if (event.target.closest('.HotelServices p')) {
            dropdown.classList.toggle('show');
        }
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.HotelServices')) {
            dropdown.classList.remove('show');

            // Закрываем все раскрытые группы
            const expandedGroups = dropdown.querySelectorAll('.group-content.expanded');
            const expandedArrows = dropdown.querySelectorAll('.arrow.expanded');

            expandedGroups.forEach(group => group.classList.remove('expanded'));
            expandedArrows.forEach(arrow => arrow.classList.remove('expanded'));
        }
    });
}

// Функция для обновления данных с сервера (пример)
function updateServicesFromServer(newServices) {
    // Здесь будет код для получения данных с сервера
    // Например:
    // fetch('/api/hotel-services')
    //     .then(response => response.json())
    //     .then(data => {
    //         hotelServices = data;
    //         // Пересоздаем меню с новыми данными
    //         const oldDropdown = document.getElementById('servicesDropdown');
    //         if (oldDropdown) {
    //             oldDropdown.remove();
    //         }
    //         initHotelServicesMenu();
    //     });
}

// Функция для получения выбранных услуг
function getSelectedServices() {
    return selectedServices;
}

// Функция для сброса выбранных услуг
function resetSelectedServices() {
    selectedServices = {};
    const checkboxes = document.querySelectorAll('#servicesDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}