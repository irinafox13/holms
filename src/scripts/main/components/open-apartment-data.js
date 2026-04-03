import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';
import {OpenModal} from '@main/components/modal/open-modal';
import {ApartmentSlider} from '@main/components/sliders/apartment-slider';
import apartmentCardTemplate from '@partials/apartment-card.hbs?raw';
import sliderNavigationTemplate from '@partials/slider-navigation.hbs?raw';
import {OpenBookingRequest} from '@main/components/open-booking-request';

Handlebars.registerPartial('slider-navigation', sliderNavigationTemplate);
const apartmentCard = Handlebars.compile(apartmentCardTemplate);

/**
 * Класс для открытия формы заявки бронирования коммерческого объекта
 * @class
 */
class OpenApartmentData {
  constructor() {
    this.apartmentModal = null;
    this.modalContent = null;
    this.button = null;
    this.apartmentId = null;
    this.apartmentsSection = null;
    this.routeUrl = null;

    this.init();
  }

  /**
   * Инициализация компонента
   */
  init() {
    // Проверяем наличие необходимых DOM элементов
    this.apartmentModal = document.querySelector('.js-modal[data-modal-name="apartment"]');

    if (!this.apartmentModal) {
      return;
    }

    this.modalContent = this.apartmentModal.querySelector('.js-modal-content');

    if (!this.modalContent) {
      return;
    }

    this.bindEventListeners();
  }

  /**
   * Проверяет, является ли элемент или его родитель кнопкой
   * @param {HTMLElement} element
   * @returns {HTMLElement|null}
   */
  getButtonElement(element) {
    if (element.classList.contains('js-open-apartment-data')) {
      return element;
    }
    return element.closest('.js-open-apartment-data');
  }

  /**
   * Валидирует необходимые данные
   * @returns {boolean}
   */
  validateData() {
    if (!this.button) {
      return false;
    }

    this.apartmentId = this.button.dataset.id;
    if (!this.apartmentId) {
      return false;
    }

    this.apartmentsSection = this.button.closest('.js-apartments-section');
    if (!this.apartmentsSection) {
      return false;
    }

    this.routeUrl = this.apartmentsSection.dataset.url;
    if (!this.routeUrl) {
      return false;
    }

    return true;
  }

  /**
   * Запрос данных объекта
   */
  async requestPropertyData() {
    if (!this.validateData()) {
      return;
    }

    try {
      this.setLoadingState(true);

      const {data} = await axios({
        url: this.routeUrl,
        method: 'GET',
        params: {
          id: this.apartmentId,
        },
      });

      if (data?.success) {
        Modal.open(this.apartmentModal);
        this.addApartmentData(data.data);
        this.refreshComponents();
      } else {
        console.error(data?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Устанавливает состояние загрузки
   * @param {boolean} isLoading
   */
  setLoadingState(isLoading) {
    if (isLoading) {
      this.button.classList.add('waiting');
    } else {
      this.button.classList.remove('waiting');
    }
  }

  /**
   * Добавляет данные в модальное окно
   * @param {Object} data
   */
  addApartmentData(data) {
    this.modalContent.innerHTML = '';
    this.modalContent.insertAdjacentHTML('beforeend', apartmentCard({content: data}));
  }

  /**
   * Инициализирует компоненты после добавления DOM
   */
  refreshComponents() {
    const slider = this.modalContent.querySelector('.js-apartment-slider');
    if (slider) {
      new ApartmentSlider(slider);
    }

    const bookingRequest = this.modalContent.querySelector('.js-open-booking-request');
    if (bookingRequest) {
      new OpenBookingRequest(bookingRequest);
    }

    const modalButton = this.modalContent.querySelector('.js-modal-open-button');
    if (modalButton) {
      new OpenModal(modalButton);
    }

    // Обновляем fslightbox после добавления новых элементов
    if (typeof window.refreshFsLightbox === 'function') {
      window.refreshFsLightbox();
    }
  }

  /**
   * Привязывает обработчики событий
   */
  bindEventListeners() {
    document.addEventListener('click', async (e) => {
      const button = this.getButtonElement(e.target);

      if (button) {
        e.preventDefault();
        this.button = button;
        await this.requestPropertyData();
      }
    });
  }
}

new OpenApartmentData();
