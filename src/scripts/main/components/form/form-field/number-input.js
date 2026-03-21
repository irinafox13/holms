import { Input } from '@main/components/form/form-field/input'
import { replaceBadInNumber } from '@main/helpers/number-format'

/** Класс для поля ввода числа. */
export class NumberInput extends Input {
  /**
   * Конструктор класса.
   *
   * @param {object} props Параметры компонента.
   * @param {array} props.productsIds Список ИД товаров в списке.
   */
  constructor(props) {
    super(props)
  }

  /**
   * Прослушиваем события в инпуте с числом.
   *
   * @returns {void}
   */
  bindEventListeners() {
    super.bindEventListeners()
    this.el.addEventListener('paste', this.onPaste)
  }

  /**
   * Обработчик ввода в инпуте.
   *
   * @param {Event} e Событие, происходящее при вводе в инпуте.
   * @returns {void}
   */
  onInput = (e) => {
    super.onInput(e)
    const input = e.target
    this.applyMask(input)
  }

  /**
   * Применение маски к числу.
   *
   * @param {HTMLInputElement} input Поле ввода.
   * @returns {void}
   */
  applyMask(input) {
    if (input.value) {
      input.value = replaceBadInNumber(input.value)
    }
  }

  /**
   * Обработчик вставки скопированного номера.
   *
   * @param {Event} e Событие, происходящее при вставке скопированного номера.
   * @returns {void}
   */
  onPaste = (e) => {
    const input = e.target
    this.applyMask(input)
  }
}
