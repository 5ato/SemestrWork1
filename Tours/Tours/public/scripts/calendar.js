class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.startDate = this.currentDate;
        this.endDate = new Date();
        this.endDate.setDate(this.currentDate.getDate() + 6);
        this.MAX_DAYS = 20;

        this.daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        this.months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        this.monthNamesShort = [
            'янв', 'фев', 'мар', 'апр', 'май', 'июн',
            'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
        ];

        // Устанавливаем ограничения по датам
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);

        this.minDate = new Date(this.today);

        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
        this.maxDate.setMonth(this.maxDate.getMonth());
        this.maxDate.setDate(0);

        this.init();
    }

    init() {
        this.createCalendarHTML();
        this.bindEvents();
        this.renderCalendar();
        this.applyDates();
    }

    createCalendarHTML() {
        // Создаем выпадающий календарь как дочерний элемент #dateFlight
        const dateFlightElement = document.getElementById('dateFlight');

        const calendarDropdown = document.createElement('div');
        calendarDropdown.id = 'calendarDropdown';
        calendarDropdown.className = 'calendar-dropdown';
        calendarDropdown.style.display = 'none';

        calendarDropdown.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <a class="navigation-btn" id="prev-month">←</a>
                    <h3 id="current-month"></h3>
                    <a class="navigation-btn" id="next-month">→</a>
                </div>
                
                <div class="calendar-grid" id="calendar-grid">
                    <!-- Days will be generated here -->
                </div>
                
                <div class="period-info">
                    <div id="selected-period"></div>
                    <div id="days-info" class="days-counter"></div>
                    <div id="warning-message" class="warning"></div>
                    
                    <div style="margin-top: 10px; font-size: 12px; color: #666;">
                        <strong>Ограничения:</strong><br>
                        • Доступный период: с <span id="minDateText"></span> (сегодня) по <span id="maxDateText"></span><br>
                        • Максимальная продолжительность: ${this.MAX_DAYS} дней
                    </div>
                </div>
                
                <div class="calendar-actions">
                    <a class="btn btn-secondary" id="cancel-btn">Отмена</a>
                    <a class="btn btn-primary" id="apply-btn">Применить</a>
                </div>
            </div>
        `;

        dateFlightElement.appendChild(calendarDropdown);

        // Показываем ограничения дат
        document.getElementById('minDateText').textContent = this.formatDateForDisplay(this.minDate);
        document.getElementById('maxDateText').textContent = this.formatDateForDisplay(this.maxDate);
    }

    bindEvents() {
        // Обработчик клика по фильтру
        document.getElementById('dateFlight').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCalendar();
        });

        // Закрытие календаря при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#dateFlight')) {
                this.closeCalendar();
            }
        });

        // Предотвращаем закрытие при клике внутри календаря
        document.getElementById('calendarDropdown').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Кнопки навигации
        document.getElementById('prev-month').addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeMonth(-1);
        });

        document.getElementById('next-month').addEventListener('click', (e) => {
            e.stopPropagation();
            this.changeMonth(1);
        });

        // Кнопки действий
        document.getElementById('cancel-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeCalendar();
        });

        document.getElementById('apply-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.applyDates();
        });
    }

    toggleCalendar() {
        const dropdown = document.getElementById('calendarDropdown');

        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
            this.renderCalendar();
        }
    }

    closeCalendar() {
        document.getElementById('calendarDropdown').style.display = 'none';
    }

    applyDates() {
        if (this.startDate && this.endDate) {
            const dateFlightValue = document.getElementById('dateFlightValue');
            dateFlightValue.textContent = `${this.formatDateShort(this.startDate)} - ${this.formatDateShort(this.endDate)}`;
            this.closeCalendar();
        } else {
            alert('Пожалуйста, выберите период дат');
        }
    }

    formatDateShort(date) {
        const day = date.getDate();
        const month = this.monthNamesShort[date.getMonth()];
        return `${day} ${month}`;
    }

    formatDateForDisplay(date) {
        return date.toLocaleDateString('ru-RU');
    }

    renderCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        const currentMonthElement = document.getElementById('current-month');
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');

        // Очищаем календарь
        calendarGrid.innerHTML = '';

        // Заголовки дней недели
        this.daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // Устанавливаем текущий месяц и год
        currentMonthElement.textContent = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        // Обновляем состояние кнопок навигации
        prevMonthBtn.disabled = this.isMinMonth();
        nextMonthBtn.disabled = this.isMaxMonth();

        // Получаем первый день месяца и количество дней
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Пустые ячейки перед первым днем месяца
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const currentDayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            currentDayDate.setHours(0, 0, 0, 0);

            dayElement.className = 'day';
            dayElement.textContent = day;
            dayElement.dataset.date = currentDayDate.toISOString().split('T')[0];

            // Проверяем, является ли день сегодняшним
            if (currentDayDate.getTime() === this.today.getTime()) {
                dayElement.classList.add('today');
            }

            // Проверяем, находится ли день в разрешенном диапазоне
            if (currentDayDate < this.minDate || currentDayDate > this.maxDate) {
                dayElement.classList.add('disabled');
            } else {
                // Проверяем, находится ли день в выбранном периоде
                if (this.startDate && this.endDate && currentDayDate >= this.startDate && currentDayDate <= this.endDate) {
                    dayElement.classList.add('in-range');
                    if (currentDayDate.getTime() === this.startDate.getTime() || currentDayDate.getTime() === this.endDate.getTime()) {
                        dayElement.classList.add('selected');
                    }
                } else if (this.startDate && !this.endDate && currentDayDate.getTime() === this.startDate.getTime()) {
                    dayElement.classList.add('selected');
                }

                if (!dayElement.classList.contains('disabled')) {
                    dayElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectDate(currentDayDate);
                    });
                }
            }

            calendarGrid.appendChild(dayElement);
        }

        this.updateSelectedPeriodDisplay();
    }

    selectDate(date) {
        const warningElement = document.getElementById('warning-message');
        warningElement.textContent = '';

        if (!this.startDate || (this.startDate && this.endDate)) {
            this.startDate = date;
            this.endDate = null;
        } else {
            if (date < this.startDate) {
                this.endDate = this.startDate;
                this.startDate = date;
            } else {
                this.endDate = date;
            }

            const daysDiff = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
            if (daysDiff > this.MAX_DAYS) {
                warningElement.textContent = `Максимальный период - ${this.MAX_DAYS} дней! Выберите меньший период.`;
                this.endDate = null;
            }
        }
        this.renderCalendar();
    }

    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    isMinMonth() {
        const currentMonthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const minMonthStart = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1);
        return currentMonthStart <= minMonthStart;
    }

    isMaxMonth() {
        const currentMonthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const maxMonthStart = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
        return currentMonthStart >= maxMonthStart;
    }

    updateSelectedPeriodDisplay() {
        const displayElement = document.getElementById('selected-period');
        const daysInfoElement = document.getElementById('days-info');
        const warningElement = document.getElementById('warning-message');

        if (this.startDate && this.endDate) {
            const daysDiff = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;

            displayElement.innerHTML = `
                <strong>Выбранный период:</strong><br>
                С: ${this.startDate.toLocaleDateString('ru-RU')}<br>
                По: ${this.endDate.toLocaleDateString('ru-RU')}
            `;

            daysInfoElement.innerHTML = `
                <span class="${daysDiff <= this.MAX_DAYS ? 'success' : 'warning'}">
                    Дней: ${daysDiff} ${daysDiff <= this.MAX_DAYS ? '✓' : '✗'}
                </span>
            `;

        } else if (this.startDate) {
            displayElement.innerHTML = `
                <strong>Выберите конечную дату</strong><br>
                Начальная дата: ${this.startDate.toLocaleDateString('ru-RU')}
            `;
            daysInfoElement.textContent = '';
        } else {
            displayElement.innerHTML = '<strong>Выберите начальную дату</strong>';
            daysInfoElement.textContent = '';
        }
    }

    // Методы для внешнего использования
    getSelectedPeriod() {
        return {
            startDate: this.startDate,
            endDate: this.endDate
        };
    }

    setSelectedPeriod(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.renderCalendar();
    }
}

let calendar;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    calendar = new Calendar();
});