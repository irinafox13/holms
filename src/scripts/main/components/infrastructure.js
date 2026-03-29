import axios from 'axios';
import {MD_WIDTH, LG_WIDTH} from '@main/helpers/consts';
import {Tooltip} from '@main/components/tooltip';
const SHIFT_COORD_LG_FOR_DESKTOP = 0.0113;
const RESTRICT_MAP_AREA = [
  [79.27135, -35.51953],
  [-35.59522, -142.91016],
];

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
    this.url = this.map.dataset.url;
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
    this.infrastructurePoints;

    this.init();
    this.updateScreenSize();
    window.addEventListener('resize', () => this.updateScreenSize());
    this.bindEventListeners();
  }

  init = async () => {
    this.infrastructurePoints = await this.getMapData();
    
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

  /**
   * Получение точек для карты
   * @returns {Promise<*>}
   */
  async getMapData() {
    try {
      const {data} = await axios({
        url: this.url,
        method: 'GET',
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  createCollections() {
    // Создаем коллекции для каждой категории
    const categories = ['school', 'shop', 'medical', 'sport', 'transport', 'park', 'food'];

    categories.forEach((category) => {
      this.collections[category] = new window.ymaps.GeoObjectCollection();
      if (this.infrastructurePoints[category]) {
        this.infrastructurePoints[category].forEach((point) => {
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
    // После создания коллекций обновляем тултипы фильтров
    this.updateFilterTooltips();
  };

  addMainPlacemark() {
    this.mainPlacemark = new window.ymaps.Placemark(
      [Number(this.lt), Number(this.lg)],
      {
        hintContent: `<div class="map-tooltip">
        <h3 class="map-tooltip__name">Жилой квартал «Холмс»</h3></div>`,
      },
      {
        iconLayout: 'default#image',
        iconImageHref: '/images/svg/pin-holms.svg',
        iconImageSize: [58, 65],
        iconImageOffset: [-28, -65],
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

  updateDropdownButtonText() {
    const activeItem = Array.from(this.filterItems).find((item) => item.classList.contains('map-nav__item--active'));

    if (activeItem) {
      const type = activeItem.dataset.type;
      let selectedText;

      // Если выбран фильтр "all", выводим "Показать все"
      if (type === 'all') {
        selectedText = 'Показать все';
      } else {
        selectedText = activeItem.querySelector('.map-nav__item-name')?.textContent || activeItem.textContent;
      }

      this.dropdownBtn.textContent = selectedText;
    }
  }

  /**
   * Проверяет, есть ли объекты для указанной категории
   * @param {string} category - категория фильтра
   * @returns {boolean} - true если есть объекты, false если нет
   */
  hasObjectsInCategory(category) {
    if (category === 'all') {
      return Object.values(this.collections).some((collection) => collection.getLength() > 0);
    }
    return this.collections[category] && this.collections[category].getLength() > 0;
  }

  /**
   * Обновляет состояние тултипов для элементов фильтра
   */
  updateFilterTooltips() {
    this.filterItems.forEach((item) => {
      const type = item.dataset.type;

      // Проверяем, есть ли объекты для этой категории
      const hasObjects = this.hasObjectsInCategory(type);
      // Удаляем существующий тултип, если он есть
      if (item._tooltip) {
        item._tooltip.tippy.destroy();
        item._tooltip = null;
      }

      // Удаляем класс js-tooltip, если он был добавлен
      item.classList.remove('js-tooltip');

      // Если объектов нет, добавляем тултип
      if (!hasObjects && type !== 'all') {
        item.classList.add('js-tooltip');
        item.setAttribute('data-title', 'Нет объектов');
        item.setAttribute('data-text', 'Выберите другой фильтр');
        item.setAttribute('data-placement', 'right');

        // Инициализируем тултип
        item._tooltip = new Tooltip(item);
      }
    });
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
        }

        // Обновляем текст кнопки
        this.updateDropdownButtonText();

        // Закрываем dropdown после выбора
        this.closeDropdown();
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
