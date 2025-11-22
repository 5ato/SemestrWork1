class NightsSelector {
    constructor() {
        this.startNight = 6;
        this.endNight = 14;
        this.MAX_NIGHTS = 15;

        this.init();
    }

    init() {
        this.createNightsDropdown();
        this.bindEvents();

        // Инициализируем значения по умолчанию
        this.updateNightsValue();
        this.renderNightsGrid();
    }

    createNightsDropdown() {
        // Создаем выпадающее меню как дочерний элемент #night
        const nightElement = document.getElementById('night');

        const nightsDropdown = document.createElement('div');
        nightsDropdown.id = 'nightsDropdown';
        nightsDropdown.className = 'nigth-dropdown';
        nightsDropdown.style.display = 'none';

        nightsDropdown.innerHTML = `
            <div class="nights-container">
                <div class="nights-header">
                    <h3 style="margin: 0 0 10px 0;">Выберите количество ночей</h3>
                    <p style="margin: 0; color: #666; font-size: 14px;">Максимум можно выбрать 15 ночей</p>
                </div>

                <div class="nights-grid" id="nights-grid">
                    <!-- Numbers will be generated here -->
                </div>

                <div class="nights-info">
                    <div id="nights-selection"></div>
                    <div id="nights-warning" class="warning"></div>
                </div>

                <div class="dropdown-actions">
                    <a class="btn btn-secondary" id="nights-cancel-btn">Отмена</a>
                    <a class="btn btn-primary" id="nights-apply-btn">Применить</a>
                </div>
            </div>
        `;

        nightElement.appendChild(nightsDropdown);
    }

    bindEvents() {
        // Обработчик клика по фильтру ночей
        document.getElementById('night').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNightsDropdown();
        });

        // Закрытие dropdown при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#night')) {
                this.closeNightsDropdown();
            }
        });

        // Предотвращаем закрытие при клике внутри dropdown
        document.getElementById('nightsDropdown').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Кнопки действий
        document.getElementById('nights-cancel-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeNightsDropdown();
        });

        document.getElementById('nights-apply-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.applyNights();
        });
    }

    toggleNightsDropdown() {
        const dropdown = document.getElementById('nightsDropdown');

        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
            this.renderNightsGrid();
        }
    }

    closeNightsDropdown() {
        document.getElementById('nightsDropdown').style.display = 'none';
    }

    applyNights() {
        if (this.startNight !== null && this.endNight !== null) {
            this.updateNightsValue();
            this.closeNightsDropdown();
        } else {
            alert('Пожалуйста, выберите диапазон ночей');
        }
    }

    updateNightsValue() {
        const nightsValue = document.getElementById('nightsValue');
        if (this.startNight === this.endNight) {
            nightsValue.textContent = this.startNight;
        } else {
            nightsValue.textContent = `${this.startNight}-${this.endNight}`;
        }
    }

    renderNightsGrid() {
        const nightsGrid = document.getElementById('nights-grid');
        nightsGrid.innerHTML = '';

        // Создаем числа от 1 до 28
        for (let i = 1; i <= 28; i++) {
            const nightElement = document.createElement('div');
            nightElement.className = 'night-item';
            nightElement.textContent = i;
            nightElement.dataset.value = i;

            // Проверяем, находится ли число в выбранном диапазоне
            if (this.startNight !== null && this.endNight !== null && i >= this.startNight && i <= this.endNight) {
                nightElement.classList.add('in-range');
                if (i === this.startNight || i === this.endNight) {
                    nightElement.classList.add('selected');
                }
            } else if (this.startNight !== null && this.endNight === null && i === this.startNight) {
                nightElement.classList.add('selected');
            }

            nightElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectNight(i);
            });
            nightsGrid.appendChild(nightElement);
        }

        this.updateNightsSelectionDisplay();
    }

    selectNight(night) {
        const warningElement = document.getElementById('nights-warning');
        warningElement.textContent = '';

        if (this.startNight === null || (this.startNight !== null && this.endNight !== null)) {
            // Начинаем новый выбор
            this.startNight = night;
            this.endNight = null;
        } else {
            // Завершаем выбор диапазона
            if (night < this.startNight) {
                this.endNight = this.startNight;
                this.startNight = night;
            } else {
                this.endNight = night;
            }

            // Проверяем ограничение по ночам
            const nightsDiff = this.endNight - this.startNight + 1;
            if (nightsDiff > this.MAX_NIGHTS) {
                warningElement.textContent = `Максимальный диапазон - ${this.MAX_NIGHTS} ночей! Выберите меньший диапазон.`;
                this.endNight = null;
            }
        }

        this.renderNightsGrid();
    }

    updateNightsSelectionDisplay() {
        const selectionElement = document.getElementById('nights-selection');
        const warningElement = document.getElementById('nights-warning');

        if (this.startNight !== null && this.endNight !== null) {
            const nightsDiff = this.endNight - this.startNight + 1;

            selectionElement.innerHTML = `
                <strong>Выбранный диапазон:</strong><br>
                От: ${this.startNight} ночей<br>
                До: ${this.endNight} ночей
            `;

            selectionElement.innerHTML += `
                <div class="${nightsDiff <= this.MAX_NIGHTS ? 'success' : 'warning'}">
                    Ночей: ${nightsDiff} ${nightsDiff <= this.MAX_NIGHTS ? '✓' : '✗'}
                </div>
            `;

        } else if (this.startNight !== null) {
            selectionElement.innerHTML = `
                <strong>Выберите конечное значение</strong><br>
                Начало: ${this.startNight} ночей
            `;
        } else {
            selectionElement.innerHTML = '<strong>Выберите начальное значение</strong>';
        }
    }

    // Методы для внешнего использования
    getSelectedNights() {
        return {
            startNight: this.startNight,
            endNight: this.endNight
        };
    }

    setSelectedNights(start, end) {
        this.startNight = start;
        this.endNight = end;
        this.updateNightsValue();
        this.renderNightsGrid();
    }
}

let nightsSelector;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    nightsSelector = new NightsSelector();
});