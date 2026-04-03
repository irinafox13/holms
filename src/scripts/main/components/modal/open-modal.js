import {Modal} from './modal';
/** Компонент для открытия модального окна. */
export class OpenModal {
  /**
   * Конструктор класса.
   *
   * @param {HTMLElement} button Кнопка, открывающая модальное окно.
   */
  constructor(button) {
    this.button = button;
    this.modalName = button.dataset.modal;
    this.init();
  }

  /** Инициализация: привязка обработчиков событий. */
  init() {
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
  }

  /**
   * Обработчик клика по кнопке.
   * Открывает модальное окно, если оно существует.
   *
   * @returns {void}
   */
  handleButtonClick() {
    const modal = this.getModalElement();
    if (modal) {
      // Закрываем все открытые модальные окна перед открытием нового
      // this.closeAllModals();

      Modal.open(modal);
    }
  }

  /**
   * Закрывает все открытые модальные окна
   *
   * @returns {void}
   */
  closeAllModals() {
    const openModals = document.querySelectorAll('.js-modal.visible');
    openModals.forEach((modal) => {
      Modal.close(modal);
    });
  }

  /**
   * Получает элемент модального окна по имени.
   *
   * @returns {HTMLElement|null} Элемент модального окна или null, если не найден.
   */
  getModalElement() {
    return document.querySelector(`.js-modal[data-modal-name='${this.modalName}']`);
  }
}

document.querySelectorAll('.js-modal-open-button').forEach((button) => new OpenModal(button));
