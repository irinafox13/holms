import {Form} from '@main/components/form/form';

/** Отправка формы аяксом. */
export class AjaxForm {
  /**
   * Конструктор класса.
   * @param {HTMLFormElement} form Форма для отправки.
   */
  constructor(form) {
    this.formElement = form;
    this.form = new Form(this.formElement);
    this.errorMessageElement = this.formElement.querySelector('.js-ajax-form-message');
    this.url = this.formElement.dataset.url;
    this.autoclose = this.formElement.dataset.autoclose;
    this.noTimeoutRedirect = this.formElement.dataset.noTimeoutRedirect;
    this.recaptchaInput = this.formElement.querySelector('.js-recaptcha-response');
    this.recaptchaKey = window.RECAPTCHA_KEY || '';
    this.bindEventListeners();
  }

  /**
   * Привязывает обработчики событий.
   */
  bindEventListeners() {
    this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
  }

  /**
   * Обрабатывает событие отправки формы.
   * @param {Event} e Событие отправки формы.
   */
  handleSubmit(e) {
    e.preventDefault();

    // if (this.recaptchaInput && typeof grecaptcha !== 'undefined') {
    //   grecaptcha.ready(() => {
    //     grecaptcha.execute(this.recaptchaKey, { action: 'submit' }).then(token => {
    //       this.recaptchaInput.value = token
    //       this.submitForm()
    //     })
    //   })
    // } else {
    this.submitForm();
    // }
  }

  /**
   * Отправляет форму и обрабатывает ответ.
   */
  async submitForm() {
    if (this.formElement.classList.contains('waiting') || !this.form.isValid) {
      return;
    }

    this.removeStatusClasses();

    await this.form.submitForm();
  }

  /**
   * Удаляет классы статуса отправки.
   */
  removeStatusClasses() {
    this.formElement.classList.remove('success', 'error');
    this.formElement.classList.add('waiting');
  }
}

document.querySelectorAll('.js-ajax-form').forEach((el) => new AjaxForm(el));
