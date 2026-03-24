import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';
import {mockHelper} from '@main/helpers/mock-helper';
import {getPropertyData} from '@mocker/index';
import propertyInfoTemplate from '@partials/property-info.hbs?raw';
const propertyInfo = Handlebars.compile(propertyInfoTemplate);

/**
 * Класс для открытия формы заявки бронирования коммерческого объекта
 * @class
 */
class OpenBookingRequest {
  /**
   * Создает экземпляр OpenBookingRequest
   * @constructor
   * @param {HTMLElement} button - HTML-элемент кнопки открытия модала
   */
  constructor(button) {
    /**
     * @type {HTMLElement}
     */
    this.button = button;
    this.propertyId = this.button.dataset.id;
    this.commercialProperties = this.button.closest('.js-commercial-properties');
    this.routeUrl = this.commercialProperties.dataset.url;
    this.bookingModal = document.querySelector('.js-modal[data-modal-name="booking"]');
    this.modalTitle = this.bookingModal.querySelector('.js-modal-title');

    this.bindEventListeners();
  }

  async requestPropertyData() {
    this.button.classList.add('waiting');

    // Функция для загрузки данных
    const loadData = async () => {
      const {data} = await axios({
        url: this.routeUrl,
        method: 'GET',
        params: {
          id: this.propertyId,
        },
      });
      this.button.classList.remove('waiting');
      if (data?.success) {
        Modal.open(this.bookingModal);
        this.addPropertyInfo(data.data);
      }
    };

    mockHelper(getPropertyData, loadData);
  }

  /**
   * Привязывает обработчики событий к кнопке
   */
  bindEventListeners() {
    this.button.addEventListener('click', this.requestPropertyData.bind(this));
  }

  addPropertyInfo(data) {
    this.modalTitle.insertAdjacentHTML('afterend', propertyInfo({content: data}));
  }
}

/**
 * Инициализирует кнопки прокрутки к началу страницы
 */
document.querySelectorAll('.js-open-booking-request').forEach((button) => new OpenBookingRequest(button));
