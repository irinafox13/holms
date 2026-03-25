const SHIFT_COORD_LG_FOR_TABLET = 0.0065;
const SHIFT_COORD_LT_FOR_TABLET = -0.00052;
const SHIFT_COORD_LG_FOR_DESKTOP = 0.0113;
const RESTRICT_MAP_AREA = [
  [79.27135, -35.51953],
  [-35.59522, -142.91016],
];

import {MD_WIDTH, LG_WIDTH} from '@main/helpers/consts';
/**
 * Компонент карта.
 */
class ContactsMap {
  defaultOptionPlacemark = {
    iconLayout: 'default#image',
    iconImageHref: '/images/svg/pin.svg',
    iconImageSize: [120, 129],
    iconImageOffset: [-60, -85],
  };

  constructor(mapNode) {
    this.map = mapNode;
    this.lg = mapNode.dataset.lg;
    this.lt = mapNode.dataset.lt;
    this.zoom = mapNode.dataset.zoom;
    this.isTabletScreen = window.innerWidth >= MD_WIDTH && window.innerWidth < LG_WIDTH;
    this.isDesktopScreen = window.innerWidth >= LG_WIDTH;

    this.init();
    this.updateScreenSize();
    window.addEventListener('resize', () => this.updateScreenSize());
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
    this.isTabletScreen = window.innerWidth >= MD_WIDTH && window.innerWidth < LG_WIDTH;
    this.isDesktopScreen = window.innerWidth >= LG_WIDTH;
  }
  
  async createMap() {
    return new Promise((resolve) => {
      window.ymaps.ready(() => {
        const centerCoords = this.getCoordsCenterMap();

        const map = new window.ymaps.Map(
          this.map.getAttribute('id'),
          {
            center: centerCoords, // [широта, долгота]
            zoom: Number(this.zoom),
            controls: [],
          },
          {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
            minZoom: 4,
            restrictMapArea: RESTRICT_MAP_AREA,
          },
        );

        const placemark = new window.ymaps.Placemark(
          [Number(this.lt), Number(this.lg)],
          {},
          {
            iconLayout: this.defaultOptionPlacemark.iconLayout,
            iconImageHref: this.defaultOptionPlacemark.iconImageHref,
            iconImageSize: this.defaultOptionPlacemark.iconImageSize,
            iconImageOffset: this.defaultOptionPlacemark.iconImageOffset,
          },
        );

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

        map.controls.remove('rulerControl');
        map.controls.add(zoomControl);
        map.controls.add(fullscreenControl);
        map.behaviors.disable('scrollZoom');
        map.geoObjects.add(placemark);

        resolve({
          map: map,
          objects: map.geoObjects,
        });
      });
    });
  }

  getCoordsCenterMap() {
    const lg = Number(this.lg);
    const lt = Number(this.lt);

    if (isNaN(lg) || isNaN(lt)) {
      return [58.594344, 49.677814];
    }

    // Возвращаем массив [широта, долгота] для центра карты
    if (this.isTabletScreen) {
      return [lt - SHIFT_COORD_LT_FOR_TABLET, lg - SHIFT_COORD_LG_FOR_TABLET];
    }
    if (this.isDesktopScreen) {
      return [lt, lg - SHIFT_COORD_LG_FOR_DESKTOP];
    }

    return [lt, lg];
  }
}

// document.addEventListener('DOMContentLoaded', () => {
const mapNode = document.querySelector('.js-contacts-map');
if (mapNode) {
  new ContactsMap(mapNode);
}
// });
