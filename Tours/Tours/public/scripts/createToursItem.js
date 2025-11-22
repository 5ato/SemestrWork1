function createTourItem(tour, toursList) {
    // Создаем основные элементы
    const tourItem = document.createElement('div');
    tourItem.className = 'ToursFiltered__Item';

    // Блок с изображением
    const imageDiv = document.createElement('div');
    imageDiv.className = 'ToursFiltered__Item__Image';

    const image = document.createElement('img');
    image.src = tour.ImagePath;
    image.alt = tour.HotelName;

    imageDiv.appendChild(image);

    // Блок с информацией
    const infoDiv = document.createElement('div');
    infoDiv.className = 'ToursFiltered__Info';

    // Рейтинг
    const rating = document.createElement('p');
    rating.className = 'TourInfo__Rating';
    rating.textContent = `Рейтинг: ${tour.CountStars}`;

    // Название отеля
    const hotelName = document.createElement('h3');
    hotelName.className = 'TourInfo__HotelName';
    hotelName.textContent = tour.HotelName;

    // Страна и город
    const location = document.createElement('p');
    location.className = 'TourInfo__CountryCity';
    location.textContent = `${tour.CountryName}, ${tour.CityName}`;

    // Описание
    const description = document.createElement('p');
    description.className = 'TourInfo__Description';
    description.textContent = tour.Description;

    // Цена
    const priceDiv = document.createElement('div');
    priceDiv.className = 'TourInfo__Price';

    const priceValue = document.createElement('div');
    priceValue.innerHTML = `${tour.Price}<span>Руб</span>`;

    const button = document.createElement('button');
    button.textContent = '>';

    priceDiv.appendChild(priceValue);
    priceDiv.appendChild(button);

    // Собираем все вместе
    infoDiv.appendChild(rating);
    infoDiv.appendChild(hotelName);
    infoDiv.appendChild(location);
    infoDiv.appendChild(description);
    infoDiv.appendChild(priceDiv);

    tourItem.appendChild(imageDiv);
    tourItem.appendChild(infoDiv);

    tourItem.addEventListener('click', () => {
        window.location.href = `/TourEndpoint?TourId=${tour.Id}`
    })

    toursList.appendChild(document.createElement('hr'));

    toursList.appendChild(tourItem);

    return tourItem;
};