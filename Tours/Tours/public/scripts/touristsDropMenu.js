class TouristsSelector {
    constructor() {
        this.adults = 2;
        this.children = 0;
        this.maxAdults = 6;
        this.maxChildren = 3;

        this.init();
    }

    init() {
        this.createDropdown();
        this.bindEvents();
        this.updateDisplay();
    }

    createDropdown() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'tourists-dropdown';

        this.dropdown.innerHTML = `
                        <div class="counter">
                            <div class="counter__label">
                                <div>Взрослые</div>
                                <div class="counter__description">от 16 лет</div>
                            </div>
                            <div class="counter__controls">
                                <button class="counter__button minus-adult" type="button">-</button>
                                <span class="counter__value adult-value">${this.adults}</span>
                                <button class="counter__button plus-adult" type="button">+</button>
                            </div>
                        </div>
                        <div class="counter">
                            <div class="counter__label">
                                <div>Дети</div>
                                <div class="counter__description">от 2 до 15 лет</div>
                            </div>
                            <div class="counter__controls">
                                <button class="counter__button minus-child" type="button">-</button>
                                <span class="counter__value child-value">${this.children}</span>
                                <button class="counter__button plus-child" type="button">+</button>
                            </div>
                        </div>
                    `;

        document.getElementById('tourists').appendChild(this.dropdown);
    }

    bindEvents() {
        // Клик по основному блоку
        document.getElementById('tourists').addEventListener('click', (e) => {
            if (!e.target.closest('.tourists-dropdown')) {
                this.toggleDropdown();
            }
        });

        // Кнопки для взрослых
        this.dropdown.querySelector('.plus-adult').addEventListener('click', () => {
            this.changeAdults(1);
        });

        this.dropdown.querySelector('.minus-adult').addEventListener('click', () => {
            this.changeAdults(-1);
        });

        // Кнопки для детей
        this.dropdown.querySelector('.plus-child').addEventListener('click', () => {
            this.changeChildren(1);
        });

        this.dropdown.querySelector('.minus-child').addEventListener('click', () => {
            this.changeChildren(-1);
        });

        // Закрытие при клике вне блока
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#tourists')) {
                this.closeDropdown();
            }
        });
    }

    changeAdults(change) {
        const newValue = this.adults + change;

        if (newValue >= 1 && newValue <= this.maxAdults) {
            this.adults = newValue;
            this.updateDisplay();
        }
    }

    changeChildren(change) {
        const newValue = this.children + change;

        if (newValue >= 0 && newValue <= this.maxChildren) {
            this.children = newValue;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        // Обновляем значения в выпадающем меню
        this.dropdown.querySelector('.adult-value').textContent = this.adults;
        this.dropdown.querySelector('.child-value').textContent = this.children;

        // Обновляем кнопки минус для взрослых
        this.dropdown.querySelector('.minus-adult').disabled = this.adults <= 1;

        // Обновляем кнопки плюс для взрослых
        this.dropdown.querySelector('.plus-adult').disabled = this.adults >= this.maxAdults;

        // Обновляем кнопки минус для детей
        this.dropdown.querySelector('.minus-child').disabled = this.children <= 0;

        // Обновляем кнопки плюс для детей
        this.dropdown.querySelector('.plus-child').disabled = this.children >= this.maxChildren;

        // Обновляем текст в основном блоке
        this.updateMainText();
    }

    updateMainText() {
        const touristsValue = document.getElementById('touristsValue');
        let text = '';

        if (this.adults > 0) {
            text += `${this.adults} ${this.getAdultsText(this.adults)}`;
        }

        if (this.children > 0) {
            if (text) text += ', ';
            text += `${this.children} ${this.getChildrenText(this.children)}`;
        }

        touristsValue.textContent = text || 'Выберите количество';
    }

    getAdultsText(count) {
        if (count === 1) return 'взрослый';
        if (count >= 2 && count <= 4) return 'взрослых';
        return 'взрослых';
    }

    getChildrenText(count) {
        if (count === 1) return 'ребёнок';
        if (count >= 2 && count <= 4) return 'ребёнка';
        return 'детей';
    }

    toggleDropdown() {
        this.dropdown.classList.toggle('active');
    }

    openDropdown() {
        this.dropdown.classList.add('active');
    }

    closeDropdown() {
        this.dropdown.classList.remove('active');
    }

    // Методы для получения значений
    getValues() {
        return {
            adults: this.adults,
            children: this.children,
            total: this.adults + this.children
        };
    }

    // Метод для установки значений извне
    setValues(adults, children) {
        if (adults >= 1 && adults <= this.maxAdults) {
            this.adults = adults;
        }
        if (children >= 0 && children <= this.maxChildren) {
            this.children = children;
        }
        this.updateDisplay();
    }
}

let touristsSelector;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    touristsSelector = new TouristsSelector();

    // Пример использования методов извне:
    // touristsSelector.setValues(3, 1); // Установить 3 взрослых и 1 ребёнка
    // console.log(touristsSelector.getValues()); // Получить текущие значения
});