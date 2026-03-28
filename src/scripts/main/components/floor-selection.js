import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';
import propertyInfoTemplate from '@partials/property-info.hbs?raw';
const propertyInfo = Handlebars.compile(propertyInfoTemplate);

/**
 * Класс для открытия модала с планировкой этажа
 * @class
 */
export class FloorSelection {
  /**
   * Создает экземпляр OpenBookingRequest
   * @constructor
   * @param {HTMLElement} element - HTML-элемент области этажа на картинке дома
   */
  constructor(element) {
    /**
     * @type {HTMLElement}
     */
    this.element = element;
    this.floorId = this.element.getAttribute('id');
    this.interactiveChoiceBlock = this.element.closest('.js-interactive-choice-block');
    this.routeUrl = this.interactiveChoiceBlock.dataset.url;

    this.floorModal = document.querySelector('.js-modal[data-modal-name="floor"]');
    this.modalTitle = this.floorModal.querySelector('.js-modal-title');

    this.bindEventListeners();
  }

  async requestFloorData() {
    // Функция для загрузки данных
    const {data} = await axios({
      url: this.routeUrl,
      method: 'GET',
      params: {
        id: this.floorId,
      },
    });
    if (data?.success) {
      const openModals = document.querySelectorAll('.js-modal.visible');
      openModals.forEach((modal) => {
        Modal.close(modal);
      });
      Modal.open(this.floorModal);
      // this.addPropertyInfo(data.data);
    }
  }

  /**
   * Привязывает обработчики событий к кнопке
   */
  bindEventListeners() {
    this.element.addEventListener('click', this.requestFloorData.bind(this));
  }

  addPropertyInfo(data) {
    let nextElement = this.modalTitle.nextElementSibling;
    while (nextElement && nextElement.classList.contains('property-info')) {
      const elementToRemove = nextElement;
      nextElement = nextElement.nextElementSibling;
      elementToRemove.remove();
    }

    this.modalTitle.insertAdjacentHTML('afterend', propertyInfo({content: data}));
  }
}

document.querySelectorAll('.js-floor-selection').forEach((node) => new FloorSelection(node));
