import {Input} from '@main/components/form/form-field/input';
import TomSelect from 'tom-select';

/**
 * Компонент селекта.
 */
export class Select extends Input {
  /**
   * Создает компонент выбора файла.
   *
   * @param {object} props - Параметры компонента.
   * @param {HTMLElement} props.container - Родительский элемент.
   * @param {HTMLInputElement} props.input - Элемент ввода.
   */
  constructor({container, input}) {
    super({container, input});

    this.tomSelect = new TomSelect(this.input, {
      hideSelected: false,
      controlClass: 'form-field__input ts-control',
      dropdownClass: 'ts-dropdown js-mch-form-field-scroll',
      controlInput: null,
      render: {
        no_results: function () {
          return '<div class="option">Ничего не найдено</div>';
        },
      },
      onType: (str) => {
        if (str) {
          this.el.classList.add('filled');
        } else {
          this.updateIsFilledStatus();
        }
      },
    });
    this.input.classList.remove('form-field__select');

    this.input.addEventListener('setSelectValue', (e) => {
      this.tomSelect.setValue(e.detail);
      this.el.classList.add('filled');
    });
  }
}
