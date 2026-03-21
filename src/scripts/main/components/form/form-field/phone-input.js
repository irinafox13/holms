import {getInputNumberValues} from '@main/helpers/get-input-number-values';

/**
 * Класс для маски ввода телефонного номера в формате +7 (XXX) XXX-XX-XX.
 */
export class PhoneMask {
  static COUNTRY_CODE = '7';
  static MASK_PATTERN = [
    {length: 1, prefix: '+7 '},
    {length: 3, prefix: '('},
    {length: 3, prefix: ') '},
    {length: 2, prefix: '-'},
    {length: 2, prefix: '-'},
  ];

  /**
   * Создает экземпляр PhoneMask и инициализирует слушатели событий.
   * @param {HTMLInputElement} el - Элемент input для маски телефона.
   */
  constructor(el) {
    this.el = el;
    this.bindEventListeners();
    if (this.el.value) {
      this.onPhoneInput();
    }
  }

  /**
   * Добавляет обработчики событий input, keydown и paste к полю ввода.
   */
  bindEventListeners() {
    this.el.addEventListener('input', this.onPhoneInput);
    this.el.addEventListener('keydown', this.onPhoneKeyDown);
    this.el.addEventListener('paste', this.onPhonePaste);
  }

  /**
   * Обработка события ввода текста в поле.
   * Форматирует введенный номер и поддерживает позицию курсора.
   * @param {InputEvent} [e] - Событие ввода (необязательно).
   */
  onPhoneInput = () => {
    const input = this.el;
    const parent = input.parentElement;

    parent.classList.remove('input-error');

    let inputNumbersValue = getInputNumberValues(input);

    // Ограничиваем длину до 11 цифр (для РФ)
    inputNumbersValue = this.trimToLength(inputNumbersValue, 11);

    if (!inputNumbersValue) {
      input.value = '';
      return;
    }

    const selectionStart = input.selectionStart;
    const digitsBeforeCursor = this.countDigitsBeforePosition(input.value, selectionStart);

    inputNumbersValue = this.normalizeNumber(inputNumbersValue);

    const formattedValue = this.formatNumber(inputNumbersValue);

    input.value = formattedValue;

    const newCursorPosition = this.getCursorPositionFromDigitsCount(formattedValue, digitsBeforeCursor);
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  };

  /**
   * Обрезает строку с цифрами до максимальной длины.
   * @param {string} str - Строка с цифрами.
   * @param {number} maxLength - Максимальная длина.
   * @returns {string} Обрезанная строка.
   */
  trimToLength(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength);
    }
    return str;
  }

  /**
   * Приводит номер к нормализованному виду:
   * если начинается с 9, заменяет на 7 в начале.
   * @param {string} number - Номер с цифрами.
   * @returns {string} Нормализованный номер.
   */
  normalizeNumber(number) {
    if (number[0] === '9') {
      return PhoneMask.COUNTRY_CODE + number;
    }
    return number;
  }

  /**
   * Форматирует номер по маске +7 (XXX) XXX-XX-XX.
   * @param {string} number - Номер с цифрами.
   * @returns {string} Отформатированная строка.
   */
  formatNumber(number) {
    let result = '+7 ';
    if (number.length > 1) {
      result += '(' + number.substring(1, 4);
    }
    if (number.length >= 5) {
      result += ') ' + number.substring(4, 7);
    }
    if (number.length >= 8) {
      result += '-' + number.substring(7, 9);
    }
    if (number.length >= 10) {
      result += '-' + number.substring(9, 11);
    }
    return result;
  }

  /**
   * Считает количество цифр в строке до позиции pos.
   * @param {string} str - Строка для подсчёта цифр.
   * @param {number} pos - Позиция в строке.
   * @returns {number} Количество цифр до позиции.
   */
  countDigitsBeforePosition(str, pos) {
    let count = 0;
    for (let i = 0; i < pos; i++) {
      if (/\d/.test(str[i])) {
        count++;
      }
    }
    return count;
  }

  /**
   * Получает позицию курсора в отформатированной строке,
   * соответствующую количеству цифр digitsCount.
   * @param {string} formattedStr - Отформатированная строка.
   * @param {number} digitsCount - Количество цифр для позиционирования.
   * @returns {number} Позиция курсора для установки.
   */
  getCursorPositionFromDigitsCount(formattedStr, digitsCount) {
    let count = 0;
    for (let i = 0; i < formattedStr.length; i++) {
      if (/\d/.test(formattedStr[i])) {
        count++;
      }
      if (count >= digitsCount) {
        return i + 1;
      }
    }
    return formattedStr.length;
  }

  /**
   * Обработка события нажатия клавиши в поле.
   * Очищает поле если осталась 1 цифра и нажата Backspace.
   * @param {KeyboardEvent} e - Событие нажатия клавиши.
   */
  onPhoneKeyDown = (e) => {
    const input = e.target;
    const parent = input.parentElement;

    parent.classList.remove('input-error');

    if (e.key === 'Backspace' && getInputNumberValues(input).length === 1) {
      input.value = '';
    }
  };

  /**
   * Обработка события вставки текста в поле.
   * Проверяет и удаляет недопустимые символы.
   * @param {ClipboardEvent} e - Событие вставки текста.
   */
  onPhonePaste = (e) => {
    const pasted = e.clipboardData || window.clipboardData;
    const input = e.target;
    const inputNumbersValue = getInputNumberValues(input);

    if (pasted) {
      const pastedText = pasted.getData('Text');

      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
      }
    }
  };
}
