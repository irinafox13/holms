/** Базовый класс поля ввода. */
export class Input {
  /**
   * Создает компонент ввода текста.
   *
   * @param {object} props Параметры компонента.
   * @param {HTMLElement} props.container Родительский элемент.
   * @param {HTMLInputElement} props.input Элемент ввода.
   */
  constructor({container, input}) {
    this.el = container;
    this.input = input;
    this.updateIsFilledStatus();
    this.bindEventListeners();
  }

  /**
   * Вешает коллбеки событий на элементы компонента.
   *
   * @returns {void}
   */
  bindEventListeners() {
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('keyup', this.onInput.bind(this));
    this.input.addEventListener('beforeinput', this.onBeforeInput.bind(this));
    window.addEventListener('load', this.updateIsFilledStatus.bind(this));
  }

  /**
   * Обновляет класс заполненности.
   *
   * @returns {void}
   */
  updateClass() {
    const isFilled = this.input.value && this.hasLabel();
    this.el.classList.toggle('filled', isFilled);
  }

  /**
   * Получает введенное значение.
   *
   * @returns {string} Введенное значение.
   */
  getValue() {
    return this.input.value;
  }

  /**
   * Проверяет наличие лейбла.
   *
   * @returns {boolean} true, если лейбл существует, иначе false.
   */
  hasLabel() {
    return !!this.el.querySelector('.form-field__label');
  }

  /**
   * Обновляет состояние ввода, которое говорит, введено ли значение в поле, или нет.
   *
   * @returns {void}
   */
  updateIsFilledStatus() {
    this.updateClass();
  }

  /**
   * Колбэк обработки события 'input'.
   *
   * @returns {void}
   */
  onInput() {
    this.updateIsFilledStatus();
    this.enforceMaxLength();
  }

  /**
   * Принудительно ограничивает длину ввода.
   *
   * @returns {void}
   */
  enforceMaxLength() {
    if (this.input.maxLength > 0 && this.input.value.length > this.input.maxLength) {
      this.input.value = this.input.value.slice(0, this.input.maxLength);
    }
  }

  /**
   * Колбэк обработки события перед вводом - удаление символов, не удовлетворяющих паттерну.
   *
   * @param {Event} event Событие, происходящее при вводе в инпуте.
   * @returns {void}
   */
  onBeforeInput(event) {
    const patternData = this.input.pattern || this.input.dataset.pattern;
    if (patternData && event.data) {
      const pattern = new RegExp(patternData);
      if (!pattern.test(event.data)) {
        event.preventDefault();
      }
    }
  }

  /**
   * Удаляет лишние символы из строки по паттерну.
   *
   * @param {string} str Строка для форматирования.
   * @returns {string} Результат.
   */
  replaceBadCharacters(str) {
    const patternData = this.input.pattern || this.input.dataset.pattern;
    const pattern = new RegExp(patternData);
    const match = str.match(pattern);
    return match ? match[0] : '';
  }
}
