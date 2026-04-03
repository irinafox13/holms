import axios from 'axios';
import {
  EMAIL_REGEX,
  NUMBER_REGEX,
  NAME_REGEX,
  ERROR_DEFAULT,
  MAX_PHONE_LENGTH,
  NUM_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  REDIRECT_TIMEOUT,
} from '@main/helpers/consts';
import {Modal} from '@main/components/modal/modal';

import * as Validation from './validation.js';
import {startTimer} from './timer.js';

/**
 * Класс для работы с формой: валидация, отправка и управление UI.
 */
export class Form {
  /**
   * Создает экземпляр формы.
   * @param {HTMLFormElement} form Элемент формы.
   */
  constructor(form) {
    /**
     * Элемент формы.
     * @type {HTMLFormElement}
     */
    this.el = form;

    /**
     * Идентификатор формы.
     * @type {string}
     */
    this.id = this.el.getAttribute('id');

    /**
     * URL для отправки формы.
     * @type {string}
     */
    this.url = this.el.dataset.url;

    /** @type {Array<{node: HTMLElement, input: HTMLInputElement, fileField: HTMLElement | null}>} */
    this.fields = [];

    this.init();
  }

  /**
   * Инициализация: поиск элементов, привязка событий и проверка кнопки отправки.
   */
  init() {
    this.findElements();
    this.bindEventListeners();
    this.checkSubmitBtn();
  }

  /**
   * Находит нужные элементы и кэширует.
   */
  findElements() {
    this.getFields();
    this.myModal = this.el.closest('.js-modal');
    this.successModal = document.querySelector(".js-modal[data-modal-name='success']");
    this.errorModal = document.querySelector(".js-modal[data-modal-name='error']");
    this.submitBtn =
      this.el.querySelector("button[type='submit']") || document.querySelector(`button[form="${this.id}"]`);
    this.timerParent = this.el.closest('.js-form-timer-redirect');

    if (this.timerParent) {
      this.timerForm = this.timerParent.querySelector('.js-form-timer-redirect-form');
      this.timerSuccess = this.timerParent.querySelector('.js-form-timer-redirect-success');
      this.timerNode = this.timerParent.querySelector('.js-recovery-timer');
    }
  }

  /**
   * Получает поля формы
   */
  getFields() {
    const currentFields = this.el.querySelectorAll('.js-form-field');
    const inputs = document.querySelectorAll(`input[form="${this.id}"]`);
    const otherFields = Array.from(inputs)
      .map((input) => input.closest('.js-form-field'))
      .filter(Boolean);
    const allFields = otherFields.length > 0 ? [...currentFields, ...otherFields] : [...currentFields];

    this.fields = allFields.map((field) => ({
      node: field,
      input: field.querySelector('.js-form-field-input'),
      fileField: field.querySelector('.js-field-file-caption'),
    }));
  }

  /**
   * Привязывает основные обработчики событий.
   */
  bindEventListeners() {
    this.el.addEventListener('submit', this.submitForm.bind(this));
    this.el.addEventListener('reinitInputValidation', this.reinitInputValidation.bind(this));
    this.bindInputListeners();
    this.updateFields();
  }

  /**
   * Переинициализирует валидацию: обновляет элементы и обработчики.
   */
  reinitInputValidation() {
    this.findElements();
    this.bindInputListeners();
    this.updateFields();
    this.checkSubmitBtn();
  }

  /**
   * Привязывает события ввода и потери фокуса к полям.
   */
  bindInputListeners() {
    this.fields.forEach((field) => {
      const {input, node} = field;
      const handler = () => {
        this.hideFieldError(node);
        this.preventEnteringNumbersInFieldName(input);
        this.disallowSpaceInEmailField(field);
        this.checkSubmitBtn();
      };
      input.addEventListener('input', handler);
      input.addEventListener('paste', handler);
      input.addEventListener('blur', () => this.checkInput(field));
    });
  }

  /**
   * Обработка отправки формы с асинхронной отправкой данных.
   * @param {SubmitEvent} e
   */
  async submitForm(e) {
    e.preventDefault();
    if (!this.isValid) return;

    this.el.classList.add('waiting');

    // Функция для загрузки данных
    const response = await Form.fetchForm(this.el, this.url);
    this.el.classList.remove('waiting');

    if (response?.success) {
      this.handleSuccessResponse(response);
      return response;
    } else {
      this.showErrorModal(response);
    }
  }

  /**
   * Обрабатывает успешный ответ сервера.
   * @param {object} response Ответ сервера с данными.
   */
  handleSuccessResponse(response) {
    if (response.data?.redirectUrl) {
      this.submitBtn.disabled = true;
      if (this.el.dataset.noTimeoutRedirect) {
        window.location.href = response.data.redirectUrl;
      } else {
        this.showSuccessModal();
        this.showTimerBlock(response);
      }
    } else {
      this.showSuccessModal();
      this.clearForm();
    }
  }

  /**
   * Показывает модальное окно с ошибкой.
   * @param {object} response Ответ сервера с ошибкой.
   */
  showErrorModal(response) {
    if (!this.errorModal) return;
    const resultModalText = this.errorModal.querySelector('.js-modal-error');
    resultModalText.innerHTML = response?.message || ERROR_DEFAULT;
    Modal.open(this.errorModal);
  }

  /**
   * Показывает модальное окно с успешным результатом.
   */
  showSuccessModal() {
    if (this.el.dataset.noModalResult) return;
    if (!this.successModal) return;

    if (this.myModal) Modal.close(this.myModal);
    Modal.open(this.successModal);
  }

  /**
   * Показывает блок с таймером обратного отсчёта.
   * @param {object} response Ответ сервера с redirectUrl.
   */
  showTimerBlock(response) {
    if (this.timerParent) {
      this.timerForm.classList.add('hidden');
      this.timerSuccess.classList.remove('hidden');
      startTimer(this.timerNode, 60, () => {
        window.location.href = response.data.redirectUrl;
      });
    } else {
      setTimeout(() => {
        window.location.href = response.data.redirectUrl;
      }, REDIRECT_TIMEOUT);
    }
  }

  /**
   * Очищает форму и убирает ошибки.
   */
  clearForm() {
    this.fields.forEach((field) => {
      if (field.input.tagName === 'SELECT' && field.input.tomselect) {
        // Tom Select
        field.input.tomselect.clear();
      } else if (field.input.type === 'checkbox' || field.input.type === 'radio') {
        field.input.checked = false;
      } else {
        field.input.value = '';
      }
      field.node.classList.remove('filled');
      if (field.fileField) field.fileField.innerHTML = '';
      const fileCaption = field.node.querySelector('.js-form-field-file-caption');
      if (fileCaption) fileCaption.innerHTML = '';
    });
    this.checkSubmitBtn();
  }

  /**
   * Включает или отключает кнопку отправки в зависимости от валидности формы.
   */
  checkSubmitBtn() {
    if (!this.submitBtn) return;
    this.submitBtn.disabled = !this.isValidSilent;
  }

  /**
   * Скрывает ошибку на поле.
   * @param {HTMLElement} field Контейнер поля.
   */
  hideFieldError(field) {
    field.classList.remove('error');
  }

  /**
   * Запрещает ввод цифр в поле имени.
   * @param {HTMLInputElement} input Поле ввода имени.
   */
  preventEnteringNumbersInFieldName(input) {
    if (input.classList.contains('js-form-field-input-name')) {
      input.value = input.value.replace(/[+$№^*)@:, .'`";_=<>%#~&!\\(?{}[\]/|\d]/g, '');
    }
  }

  /**
   * Запрещает ввод пробелов в поле email.
   * @param {{input: HTMLInputElement}} field Объект поля с input.
   */
  disallowSpaceInEmailField(field) {
    if (field.input.type === 'email') {
      field.input.value = field.input.value.replace(/\s/g, '');
    }
  }

  /**
   * Проверяет валидность всех полей формы с показом ошибок.
   * @returns {boolean} true, если форма валидна.
   */
  get isValid() {
    return this.fields.every((field) => {
      const valid = Form.validateField(field.input);
      field.node.classList.toggle('error', !valid);
      return valid;
    });
  }

  /**
   * Проверяет валидность всех полей формы без показа ошибок.
   * @returns {boolean} true, если форма валидна.
   */
  get isValidSilent() {
    return this.fields.every((field) => Form.validateField(field.input));
  }

  /**
   * Проверяет одно поле на валидность и показывает/скрывает ошибку.
   * @param {{input: HTMLInputElement, node: HTMLElement}} field Объект поля.
   */
  checkInput(field) {
    if (field.input.required && !field.input.value) {
      field.node.classList.add('error');
    } else {
      const valid = Form.validateField(field.input);
      field.node.classList.toggle('error', !valid);
    }
  }

  /**
   * Валидирует поле ввода по разным правилам.
   * @param {HTMLInputElement} input Элемент ввода.
   * @returns {boolean} true если валидно.
   */
  static validateField(input) {
    if (input.disabled) return true;

    const isRequired = input.required && !!input.value;
    let valid = true;

    // Проверка паттерна и длины
    if (input.pattern || input.dataset.pattern) {
      valid = Validation.isValidPattern(input);
    } else if (isRequired) {
      valid = !!input.value;
    }

    if (!valid) return false;

    // Проверка типа input
    switch (input.type) {
      case 'tel':
        valid = Validation.isValidPhone(input, MAX_PHONE_LENGTH);
        break;
      case 'email':
        valid = Validation.isValidMail(input, EMAIL_REGEX);
        break;
      case 'number':
        valid = Validation.isValidNumber(input, NUMBER_REGEX);
        break;

      case 'checkbox':
        valid = Validation.isValidCheckbox(input);
        break;

      case 'password':
        if (input.classList.contains('js-novalidate')) return true;
        valid =
          Validation.isValidPasswordByLetter(input, NUM_REGEX, PASSWORD_REGEX, PASSWORD_MIN_LENGTH) &&
          Validation.isValidPasswords(input);
        break;
      case 'hidden':
        valid = true;
        break;
    }

    if (!valid) return false;

    // Дополнительные проверки по классам
    if (input.classList.contains('js-form-field-input-name')) {
      valid = Validation.isValidName(input, NAME_REGEX);
    }

    if (input.classList.contains('js-form-field-input-number')) {
      valid = Validation.isValidNumber(input, NUMBER_REGEX);
    }

    if (input.type === 'checkbox' || input.type === 'radio') {
      valid = Validation.isValidCheckbox(input);
    }

    if (input.classList.contains('js-email-input')) {
      valid = Validation.isValidMail(input, EMAIL_REGEX);
    }

    if (input.classList.contains('js-phone-input')) {
      valid = Validation.isValidPhone(input, MAX_PHONE_LENGTH);
    }

    // Проверка минимальной и максимальной длины
    valid = valid && Validation.checkMinMaxLen(input);

    return valid;
  }

  /**
   * Отправляет форму на сервер методом POST.
   * @param {HTMLFormElement} formNode Элемент формы.
   * @param {string} url URL для отправки формы.
   * @returns {Promise<object>} Ответ сервера.
   */
  static async fetchForm(formNode, url) {
    const data = new FormData(formNode);
    // ЗАМЕНИТЬ ОБРАТНО НА POST
    const {data: response} = await axios.get(url, data);
    return response;
  }

  /**
   * Обновляет поля формы при переключении вкладок (если применимо).
   */
  updateFields() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('js-tabs-item') || e.target.closest('.js-tabs-item')) {
        if (this.el.id === 'user-form') {
          this.getFields();
          this.checkSubmitBtn();
          this.bindInputListeners();
        }
      }
    });
  }
}

/**
 * Инициализация форм при событии `initFormValidation`.
 */
document.addEventListener('initFormValidation', (e) => {
  if (e.detail) {
    const element = document.querySelector(e.detail);
    if (element) {
      const form = new Form(element);
      return form.isValid;
    }
  }
});

/**
 * Инициализация форм при событии `initForm`.
 */
document.addEventListener('initForm', (e) => {
  if (e.detail) {
    const element = document.querySelector(e.detail);
    if (element) {
      new Form(element);
    }
  }
});

/**
 * Автоматическая инициализация форм с классом `.js-order-form` при загрузке скрипта.
 */
document.querySelectorAll('.js-order-form').forEach((el) => new Form(el));
