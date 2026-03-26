import {MD_WIDTH, LG_WIDTH} from '@main/helpers/consts';
const SHIFT_COORD_LG_FOR_DESKTOP = 0.0113;
const RESTRICT_MAP_AREA = [
  [79.27135, -35.51953],
  [-35.59522, -142.91016],
];

// Данные объектов инфраструктуры
const infrastructurePoints = {
  school: [
    // Школы и детские сады
    {
      id: 1,
      name: 'Средняя школа №20',
      address: 'ул. Ленина, 10',
      lat: 58.586389,
      lng: 49.675928,
    },
    {
      id: 2,
      name: 'Средняя школа №16',
      address: 'ул. Мира, 25',
      lat: 58.59364,
      lng: 49.675955,
    },
    {
      id: 3,
      name: 'Частная школа "Среда"',
      address: 'ул. Гагарина, 15',
      lat: 58.589419,
      lng: 49.68315,
    },
    {
      id: 4,
      name: 'Вятская гуманитарная гимназия',
      address: 'ул. Советская, 8',
      lat: 58.590418,
      lng: 49.683797,
    },
  ],
  shop: [
    // Магазины и ТЦ
    {
      id: 5,
      name: 'Супермаркет "Магнит"',
      address: 'ул. Кирова, 12',
      lat: 58.587759,
      lng: 49.683519,
    },
    {
      id: 6,
      name: 'Супермаркет "Система Глобус"',
      address: 'пр. Победы, 45',
      lat: 58.592843,
      lng: 49.682297,
    },
    {
      id: 7,
      name: 'Продуктовый магазин "Красное&Белое"',
      address: 'ул. Ленина, 50',
      lat: 58.588331,
      lng: 49.688738,
    },
    {
      id: 8,
      name: 'Магазин у дома "Бристоль"',
      address: 'ул. Октябрьская, 3',
      lat: 58.589063,
      lng: 49.685746,
    },
  ],
  medical: [
    // Поликлиники и аптеки
    {
      id: 9,
      name: 'Поликлиника №6',
      address: 'ул. Комсомольская, 22',
      lat: 58.590695,
      lng: 49.675218,
    },
    {
      id: 10,
      name: 'Аптека "Планета здоровья"',
      address: 'ул. Свободы, 7',
      lat: 58.592843,
      lng: 49.682297,
    },
  ],
  sport: [
    // Спорт
    {
      id: 11,
      name: 'Студии мягкого фитнеса "Softfitness"',
      address: 'ул. Спортивная, 5',
      lat: 58.592843,
      lng: 49.682297,
    },
    {
      id: 12,
      name: 'Спортивный клуб "Гагарин"',
      address: 'ул. Гагарина, 30',
      lat: 58.59485,
      lng: 49.68863,
    },
    {
      id: 13,
      name: 'Спортивные секции "Центр самбо"',
      address: 'ул. Победы, 8',
      lat: 58.590437,
      lng: 49.685549,
    },
    {
      id: 14,
      name: 'Клуб экстремальных видов спорта "В движении"',
      address: 'ул. Молодежная, 12',
      lat: 58.591422,
      lng: 49.688828,
    },
  ],
  transport: [
    // Транспорт
    {
      id: 15,
      name: 'Остановка "Центральная"',
      address: 'ул. Ленина',
      lat: 58.590869,
      lng: 49.688226,
    },
  ],
  park: [
    // Парки и зоны отдыха
    {
      id: 16,
      name: 'Городской парк',
      address: 'ул. Парковая',
      lat: 58.5885,
      lng: 49.68,
    },
  ],
  food: [
    // Рестораны и кафе
    {
      id: 17,
      name: 'Кафе "Уют"',
      address: 'ул. Ленина, 45',
      lat: 58.5895,
      lng: 49.6865,
    },
  ],
};

/**
 * Компонент карта.
 */
class Infrastructure {
  constructor(block) {
    this.block = block;
    this.map = this.block.querySelector('.js-infrastructure-map');
    this.lg = this.map.dataset.lg;
    this.lt = this.map.dataset.lt;
    this.zoom = this.map.dataset.zoom;
    this.dropdownBtn = this.block.querySelector('.js-infrastructure-dropdown-btn');
    this.dropdownList = this.block.querySelector('.js-infrastructure-dropdown-list');
    this.filterItems = this.block.querySelectorAll('.map-nav__item');

    this.isTabletScreen = window.innerWidth >= MD_WIDTH && window.innerWidth < LG_WIDTH;
    this.isDesktopScreen = window.innerWidth >= LG_WIDTH;

    this.mapInstance = null;
    this.collections = {}; // Коллекции для каждой категории
    this.mainPlacemark = null;
    this.activeFilters = ['all'];
    this.centerLat = Number(this.lt);
    this.centerLng = Number(this.lg);

    this.init();
    this.updateScreenSize();
    window.addEventListener('resize', () => this.updateScreenSize());
    this.bindEventListeners();
  }

  init() {
    const checkYmaps = () => {
      if (window.ymaps && window.ymaps.Map) {
        this.createMap();
      } else {
        setTimeout(checkYmaps, 100);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkYmaps);
    } else {
      checkYmaps();
    }
  }

  updateScreenSize() {
    this.isDesktopScreen = window.innerWidth >= LG_WIDTH;
    if (this.mapInstance) {
      this.mapInstance.setCenter(this.getCoordsCenterMap());
    }
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 1000);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  calculateWalkingTime(distanceMeters) {
    const walkingSpeed = 5;
    const walkingSpeedMetersPerMinute = (walkingSpeed * 1000) / 60;
    const timeMinutes = Math.ceil(distanceMeters / walkingSpeedMetersPerMinute);
    return timeMinutes;
  }

  formatWalkingTime(minutes) {
    if (minutes < 60) {
      return `${minutes} мин`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ч ${mins} мин`;
  }

  getHintContent(item, distance, walkingTime) {
    const distanceKm = (distance / 1000).toFixed(1);
    return `
      <div class="map-tooltip">
        <h3 class="map-tooltip__name">${item.name}</h3>
        <address class="map-tooltip__address>
           ${item.address}
        </address> 
        <div class="map-tooltip__info>
          ${distanceKm} км от ЖК
          •
          ${this.formatWalkingTime(walkingTime)} пешком
        </div>
      </div>
    `;
  }

  createMap() {
    window.ymaps.ready(() => {
      try {
        const centerCoords = this.getCoordsCenterMap();

        this.mapInstance = new window.ymaps.Map(
          this.map.getAttribute('id'),
          {
            center: centerCoords,
            zoom: Number(this.zoom),
            controls: [],
            behaviors: ['drag'],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
            minZoom: 4,
            restrictMapArea: RESTRICT_MAP_AREA,
          },
        );

        // Добавляем zoom control
        const zoomControl = new window.ymaps.control.ZoomControl({
          options: {
            size: 'small',
            position: {
              top: this.isTabletScreen ? 200 : this.isDesktopScreen ? 300 : 158,
              right: this.isDesktopScreen ? 48 : 16,
              left: 'auto',
            },
          },
        });

        const fullscreenControl = new window.ymaps.control.FullscreenControl({
          options: {
            position: {
              top: 16,
              right: this.isDesktopScreen ? 48 : 16,
              left: 'auto',
            },
          },
        });

        this.mapInstance.controls.remove('rulerControl');
        this.mapInstance.controls.add(zoomControl);
        this.mapInstance.controls.add(fullscreenControl);
        this.mapInstance.behaviors.disable('scrollZoom');

        // Создаем коллекции для каждой категории
        this.createCollections();

        // Добавляем основную метку ЖК
        this.addMainPlacemark();

        // Показываем все объекты
        this.showAllObjects();
      } catch (error) {
        console.error('Ошибка при создании карты:', error);
        this.showErrorFallback();
      }
    });
  }

  createCollections() {
    // Создаем коллекции для каждой категории
    const categories = ['school', 'shop', 'medical', 'sport', 'transport', 'park', 'food'];

    categories.forEach((category) => {
      this.collections[category] = new window.ymaps.GeoObjectCollection();
      if (infrastructurePoints[category]) {
        infrastructurePoints[category].forEach((point) => {
          const distance = this.calculateDistance(this.centerLat, this.centerLng, point.lat, point.lng);
          const walkingTime = this.calculateWalkingTime(distance);

          const placemark = new window.ymaps.Placemark(
            [point.lat, point.lng],
            {
              hintContent: this.getHintContent(point, distance, walkingTime),
            },
            {
              iconLayout: 'default#image',
              iconImageHref: `/images/infrastructure/${category}.svg`,
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -30],
            },
          );

          this.collections[category].add(placemark);
        });
      }
    });
  }

  addMainPlacemark() {
    this.mainPlacemark = new window.ymaps.Placemark(
      [Number(this.lt), Number(this.lg)],
      {hintContent: `<div class="map-tooltip">
        <h3 class="map-tooltip__name">Жилой квартал «Холмс»</h3></div>`},
      {
        iconLayout: 'default#image',
        iconImageHref: '/images/svg/pin-holms.svg',
        iconImageSize: [120, 135],
        iconImageOffset: [-60, -75],
      },
    );

    this.mapInstance.geoObjects.add(this.mainPlacemark);
  }

  showAllObjects() {
    // Очищаем карту от всех коллекций
    Object.values(this.collections).forEach((collection) => {
      this.mapInstance.geoObjects.remove(collection);
    });

    // Добавляем все коллекции
    Object.values(this.collections).forEach((collection) => {
      this.mapInstance.geoObjects.add(collection);
    });

    // Устанавливаем bounds чтобы все объекты были видны
    this.fitToBounds();
  }

  showFilteredObjects() {
    // Очищаем карту от всех коллекций
    Object.values(this.collections).forEach((collection) => {
      this.mapInstance.geoObjects.remove(collection);
    });

    if (this.activeFilters.includes('all')) {
      // Показываем все
      Object.values(this.collections).forEach((collection) => {
        this.mapInstance.geoObjects.add(collection);
      });
    } else {
      // Показываем только выбранные категории
      this.activeFilters.forEach((filter) => {
        if (this.collections[filter]) {
          this.mapInstance.geoObjects.add(this.collections[filter]);
        }
      });
    }

    // Проверяем, есть ли объекты на карте
    const hasObjects = this.mapInstance.geoObjects.getLength() > 1; // >1 потому что основная метка всегда есть

    if (!hasObjects) {
      this.showNoObjectsMessage();
    } else {
      this.hideNoObjectsMessage();
      // НЕ масштабируем карту при фильтрации
    }
  }

  fitToBounds() {
    try {
      const bounds = this.mapInstance.geoObjects.getBounds();
      if (bounds) {
        this.mapInstance.setBounds(bounds, {
          zoomMargin: 50,
          useMapMargin: true,
          checkZoomRange: true,
        });
      } else {
        // Если нет объектов, центрируем на ЖК
        this.mapInstance.setCenter([Number(this.lt), Number(this.lg)], Number(this.zoom));
      }
    } catch (e) {
      console.warn('Error setting bounds:', e);
      this.mapInstance.setCenter([Number(this.lt), Number(this.lg)], Number(this.zoom));
    }
  }

  getCoordsCenterMap() {
    const lg = Number(this.lg);
    const lt = Number(this.lt);

    if (isNaN(lg) || isNaN(lt)) {
      return [58.594344, 49.677814];
    }

    if (this.isDesktopScreen) {
      return [lt, lg - SHIFT_COORD_LG_FOR_DESKTOP];
    }

    return [lt, lg];
  }

  showErrorFallback() {
    const mapContainer = this.map;
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="infrastructure__error-fallback">
          <div class="infrastructure__error-content">
            <h3>Карта временно недоступна</h3>
          </div>
        </div>
      `;
    }
  }

  showNoObjectsMessage() {
    let messageDiv = this.block.querySelector('.infrastructure__no-objects');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.className = 'infrastructure__no-objects';
      this.map.parentNode.insertBefore(messageDiv, this.map.nextSibling);
    }
    messageDiv.innerHTML = `
      <div class="infrastructure__no-objects-content">
        <p>Нет объектов по выбранным параметрам</p>
        <button class="infrastructure__reset-filters">Сбросить фильтры</button>
      </div>
    `;
    messageDiv.style.display = 'block';

    const resetBtn = messageDiv.querySelector('.infrastructure__reset-filters');
    resetBtn.addEventListener('click', () => this.resetFilters());
  }

  hideNoObjectsMessage() {
    const messageDiv = this.block.querySelector('.infrastructure__no-objects');
    if (messageDiv) {
      messageDiv.style.display = 'none';
    }
  }

  resetFilters() {
    this.activeFilters = ['all'];
    this.filterItems.forEach((item) => {
      item.classList.remove('map-nav__item--active');
      if (item.dataset.type === 'all') {
        item.classList.add('map-nav__item--active');
      }
    });
    this.showAllObjects();
    this.hideNoObjectsMessage();
  }

  bindEventListeners() {
    this.dropdownBtn.addEventListener('click', this.toggleDropdown.bind(this));

    // Обработка фильтров
    this.filterItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const type = item.dataset.type;

        if (type === 'all') {
          this.activeFilters = ['all'];
          this.filterItems.forEach((i) => i.classList.remove('map-nav__item--active'));
          item.classList.add('map-nav__item--active');
          this.showAllObjects();
          // Закрываем dropdown после выбора
          this.closeDropdown();
        } else {
          // Убираем 'all' из фильтров
          if (this.activeFilters.includes('all')) {
            this.activeFilters = [];
            this.filterItems.forEach((i) => {
              if (i.dataset.type === 'all') {
                i.classList.remove('map-nav__item--active');
              }
            });
          }

          this.filterItems.forEach((i) => {
            if (i !== item) {
              i.classList.remove('map-nav__item--active');
            }
          });

          // Устанавливаем выбранный фильтр
          this.activeFilters = [type];
          item.classList.add('map-nav__item--active');
          this.showFilteredObjects();

          // Закрываем dropdown после выбора
          this.closeDropdown();
        }
      });
    });
  }

  toggleDropdown() {
    this.dropdownBtn.parentElement.classList.toggle('active');
  }

  closeDropdown() {
    this.dropdownBtn.parentElement.classList.remove('active');
  }
}

// Инициализация
const infrastructureBlock = document.querySelector('.js-infrastructure');
if (infrastructureBlock) {
  new Infrastructure(infrastructureBlock);
}
