import axios from 'axios';
import Handlebars from 'handlebars';
import {Modal} from '@main/components/modal/modal';
import {ApartmentSlider} from '@main/components/sliders/apartment-slider';
import {mockHelper} from '@main/helpers/mock-helper';
import {getApartmentData} from '@mocker/index';
import apartmentCardTemplate from '@partials/apartment-card.hbs?raw';
import sliderNavigationTemplate from '@partials/slider-navigation.hbs?raw';

Handlebars.registerPartial('slider-navigation', sliderNavigationTemplate);
const apartmentCard = Handlebars.compile(apartmentCardTemplate);

/**
 * Класс для открытия формы заявки бронирования коммерческого объекта
 * @class
 */
class OpenApartmentData {
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
    this.apartmentId = this.button.dataset.id;
    this.apartmentsSection = this.button.closest('.js-apartments-section');
    this.routeUrl = this.apartmentsSection.dataset.url;
    this.apartmentModal = document.querySelector('.js-modal[data-modal-name="apartment"]');
    this.modalContent = this.apartmentModal.querySelector('.js-modal-content');

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
          id: this.apartmentId,
        },
      });
      this.button.classList.remove('waiting');
      if (data?.success) {
        Modal.open(this.apartmentModal);
        this.addApartmentData(data.data);

        // Инициализируем слайдер после добавления DOM
        this.initSlider();

        // Обновляем fslightbox после добавления новых элементов
        if (typeof window.refreshFsLightbox === 'function') {
          window.refreshFsLightbox();
        }
      }
    };

    mockHelper(getApartmentData, loadData);
  }

  /**
   * Привязывает обработчики событий к кнопке
   */
  bindEventListeners() {
    this.button.addEventListener('click', this.requestPropertyData.bind(this));
  }

  addApartmentData(data) {
    this.modalContent.innerHTML = '';
    this.modalContent.insertAdjacentHTML('beforeend', apartmentCard({content: data}));
  }

  initSlider() {
    document.querySelectorAll('.js-apartment-slider').forEach((slider) => {
      new ApartmentSlider(slider);
    });
  }
}

document.querySelectorAll('.js-open-apartment-data').forEach((button) => new OpenApartmentData(button));
