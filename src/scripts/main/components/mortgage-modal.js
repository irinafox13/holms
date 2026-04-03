import {Modal} from '@main/components/modal/modal';
import {Form} from '@main/components/form/form';

class MortgageModal {
  constructor(buttonOpenModal) {
    this.buttonOpenModal = buttonOpenModal;
    this.modalMortgage = document.querySelector('.js-modal[data-modal-name="mortgage"]');
    this.bindEventListeners();

    this.calculationBlock = this.modalMortgage?.querySelector('.js-mortgage-calculation');
    this.applicationForm = this.modalMortgage?.querySelector('.js-form-mortgage-application');

    this.form = this.modalMortgage.querySelector('form');
    this.formInstanse = new Form(this.form);
  }

  /**
   * Привязывает обработчики событий
   */
  bindEventListeners() {
    const openButtons = document.querySelectorAll('.js-open-mortgage-application');

    // Добавляем обработчик на каждую кнопку
    openButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchForms(button);
      });
    });

    this.buttonOpenModal.addEventListener('click', () => {
      // Сбрасываем состояние перед открытием модала
      this.resetToInitialState();
      Modal.open(this.modalMortgage);
      const input = this.modalMortgage.querySelector('input');
      input?.blur();
    });
  }

  /**
   * Переключает формы (расчет -> заявка)
   * @param {HTMLElement} clickedButton - кнопка, по которой кликнули
   */
  switchForms(clickedButton) {
    // Находим ближайший родительский элемент .mortgage__calculation
    const calculationBlock = clickedButton.closest('.js-mortgage-calculation');

    // Находим форму заявки
    const applicationForm = clickedButton.closest('form').querySelector('.js-form-mortgage-application');

    // Проверяем, что элементы существуют
    if (calculationBlock && applicationForm) {
      // Добавляем класс hidden для блока расчета
      calculationBlock.classList.add('visually-hidden');

      // Убираем класс hidden для формы заявки
      applicationForm.classList.remove('visually-hidden');
    }
  }

  /**
   * Сбрасывает формы к первоначальному состоянию
   */
  resetToInitialState() {
    if (this.calculationBlock && this.applicationForm) {
      // Показываем блок расчета
      this.calculationBlock.classList.remove('visually-hidden');

      // Скрываем форму заявки
      this.applicationForm.classList.add('visually-hidden');

      // Очищаем значения полей формы
      this.formInstanse.clearForm();
      this.form.querySelectorAll('.js-form-field').forEach((field) => this.formInstanse.hideFieldError(field));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const openModalButton = document.querySelector('.js-open-mortgage-modal');
  if (openModalButton) {
    new MortgageModal(openModalButton);
  }
});
