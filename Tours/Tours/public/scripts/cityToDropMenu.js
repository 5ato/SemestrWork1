let cityDropdown;

async function cityToDropMenu(cityId) {
    // Список городов России
    const countries = await fetch(`/CountriesAPI/city?cityId=${cityId}`).then(response => response.json());
    console.log(countries);

    cityDropdown = new CityDropdown('toCity', countries);
}

class CityDropdown {
    constructor(containerId, countries) {
        this.container = document.getElementById(containerId);
        this.selectedCities = new Set();
        this.maxSelection = 5;
        this.valueElement = document.getElementById('toCityValue');
        this.valueElement.textContent = '----';
        this.errorToCountry = document.getElementById('searchHotelErrorToCountry');

        this.init(countries);
    }

    init(countries) {
        this.createDropdown(countries);
        this.bindEvents();
    }

    createDropdown(countries) {
        let dropdown = document.querySelector('.dropdown-menu-countries');
        if (dropdown) {
            dropdown.remove();
        }

        dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu-countries';

        countries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'city-option';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `city-${country.Name}`;
            checkbox.value = country.Id;

            const label = document.createElement('label');
            label.htmlFor = `city-${country.Name}`;
            label.textContent = country.Name;

            option.appendChild(checkbox);
            option.appendChild(label);
            dropdown.appendChild(option);
        });

        // Сообщение об ошибке
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.id = 'errorMessage';
        errorMessage.textContent = `Можно выбрать не более ${this.maxSelection} городов`;
        dropdown.appendChild(errorMessage);

        this.container.appendChild(dropdown);
        this.dropdown = dropdown;
    }

    bindEvents() {
        // Клик по контейнеру
        this.container.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                this.toggleDropdown();
            }
        });

        // Обработка чекбоксов
        this.dropdown.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                this.handleCitySelection(e.target);
            }
        });

        // Закрытие при клике вне элемента
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        this.dropdown.classList.toggle('active');
    }

    closeDropdown() {
        this.dropdown.classList.remove('active');
    }

    handleCitySelection(checkbox) {
        const city = checkbox.value;
        const errorMessage = document.getElementById('errorMessage');

        if (checkbox.checked) {
            if (this.selectedCities.size >= this.maxSelection) {
                checkbox.checked = false;
                this.showError();
                return;
            }
            this.selectedCities.add(city);
            this.hideError();
            this.errorToCountry.classList.remove('displayError');
        } else {
            this.selectedCities.delete(city);
            this.hideError();
        }

        this.updateDisplay();
    }

    showError() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'block';

        // Автоматическое скрытие ошибки через 3 секунды
        setTimeout(() => {
            this.hideError();
        }, 3000);
    }

    hideError() {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.style.display = 'none';
    }

    updateDisplay() {
        // Обновляем отображаемое значение
        if (this.selectedCities.size === 0) {
            this.valueElement.textContent = '----';
        } else {
            this.valueElement.textContent = `Выбранно: ${this.selectedCities.size}/${this.maxSelection}`;
        }
    }

    // Метод для получения выбранных городов
    getSelectedCities() {
        return Array.from(this.selectedCities).map(c => Number(c));
    }

    // Метод для очистки выбора
    clearSelection() {
        this.selectedCities.clear();
        this.updateDisplay();

        const checkboxes = this.dropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.disabled = false;
        });
    }
}
