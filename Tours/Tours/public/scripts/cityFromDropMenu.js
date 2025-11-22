let cityId;

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Загружаем города
        const response = await fetch("/RussiaCitiesAPI/all");
        const cities = await response.json();
        const errors = document.getElementById('searchHotelErrorRussiaCity');

        console.log(cities);

        // Заполняем select
        const fromCityValue = document.getElementById('fromCityValue');
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.Id;
            option.textContent = city.Name;
            fromCityValue.appendChild(option);
        });

        fromCityValue.addEventListener('change', function () {
            cityId = this.value;
            errors.classList.remove('displayError');

            if (cityId) {
                cityToDropMenu(cityId);
            }
        });

        // setupEventListener();
    } catch (error) {
        console.error('Ошибка загрузки городов:', error);
    }
});