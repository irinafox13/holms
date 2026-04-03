import {ToggleScroll} from './toggle-scroll';

const TIMEOUT_HIDE_INFO_MESSAGE = 3000;

/** Компонент модала. */
export class Modal {
  /**
   * Создаёт компонент модала.
   *
   * @param {HTMLElement} el Родительский элемент модала (элемент заднего фона).
   */
  constructor(el) {
    this.el = el;
    this.isClose = false;
    this.bindEventListeners();
    if (this.el.classList.contains('js-modal-opened')) {
      Modal.open(this.el);
    }
  }

  /**
   * Вешает колбеки закрытия модала.
   *
   * @returns {void}
   */
  bindEventListeners() {
    this.el.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('js-modal-close') || e.target.closest('.js-modal-close')) {
        Modal.close(this.el);
      }
    });

    this.el.addEventListener('mouseup', (e) => e.stopPropagation());
    this.el.addEventListener('touchend', (e) => e.stopPropagation());

    document.addEventListener('keydown', (e) => {
      const keyName = e.key;
      if ((keyName === 'Escape' || keyName === 'Esc') && this.el.classList.contains('visible')) {
        Modal.close(this.el);
      }
    });
  }

  /**
   * Закрывает модал.
   *
   * @param {HTMLElement} modal Главный элемент модала.
   * @returns {void}
   */
  static close(modal) {
    modal.classList.remove('visible');

    // Проверяем, есть ли другие открытые модальные окна
    const otherModals = document.querySelectorAll('.js-modal.visible');
    const hasOtherModals = otherModals.length > 0;

    // Включаем scroll только если нет других открытых модалок
    if (!hasOtherModals) {
      ToggleScroll.enable(modal);
    }

    this.isClose = true;
  }

  /**
   * Открывает модал.
   *
   * @param {Element} modal Главный элемент модала.
   * @returns {void}
   */
  static open(modal) {
    // Проверяем, есть ли другие открытые модальные окна
    const otherModals = document.querySelectorAll('.js-modal.visible');
    const hasOtherModals = otherModals.length > 0;

    modal.classList.add('visible');

    // Включаем prevent scroll только если нет других открытых модалок
    if (!hasOtherModals) {
      ToggleScroll.disable(modal);
    }

    // Устанавливаем фокус на первое поле ввода
    const input = modal.querySelector('input');
    if (input) {
      input.focus();
    }

    if (modal.classList.contains('js-modal-autoclose')) {
      Modal.autoclose(modal);
    }
  }

  /**
   * Закртыть модал по таймауту.
   *
   * @param {Element} modal Главный элемент модала.
   * @returns {void}
   */
  static autoclose(modal) {
    setTimeout(() => {
      if (!this.isClose) {
        Modal.close(modal);
      }
    }, TIMEOUT_HIDE_INFO_MESSAGE);
  }

  /**
   * Показать модал с ошибкой.
   *
   * @param {string} message Текст ошибки.
   * @returns {void}
   */
  static showErrorModal(message = '') {
    const modalError = document.querySelector(".js-modal[data-modal-name='error']");
    if (modalError) {
      if (message) {
        modalError.querySelector('.js-modal-error').innerHTML = message;
      }
      Modal.open(modalError);
    }
  }
}

document.querySelectorAll('.js-modal').forEach((el) => new Modal(el));
