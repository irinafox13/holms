import {FORMAT_NUMBER_REGEX, DIGITS_WITH_POINT_REGEX} from '@main/helpers/consts';

/**
 * Удаляет лишние символы из числа.
 *
 * @param {string} str Строка для форматирования.
 * @returns {string} Число.
 */
export const replaceBadInNumber = (str) => {
  let last = '';
  const match = str.replace(',', '.').replace(' ', '').match(DIGITS_WITH_POINT_REGEX);
  if (match || str === '') {
    last = match ? match[0] : '';
  }
  return last;
};

/**
 * Преобразует 10000 -> 10 000.
 *
 * @param {string} str Строка для форматирования.
 * @returns {string} 10000 -> 10 000.
 */
export const numberFormat = (str) => {
  return replaceBadInNumber(str).replace(FORMAT_NUMBER_REGEX, ' ').replace('.00', '');
};

/**
 * Преобразует 10000 -> 10 000 ₽.
 *
 * @param {string} price Строка для форматирования.
 * @returns {string} 10000 -> 10 000 ₽.
 */
export const priceFormat = (price) => {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  });
  return formatter.format(Number(price));
};

/**
 * Преобразует 10 000 -> 10000.
 *
 * @param {string} str Строка для форматирования.
 * @returns {number} 10 000 -> 10000.
 */
export const getRealNumber = (str) => {
  return Number(replaceBadInNumber(str));
};

/**
 * Преобразует 24.7799999 -> 24.78 && 24.00 -> 24.
 *
 * @param {number} number Число для форматирования.
 * @returns {string} 24.7799999 -> 24.78.
 */
export const toFixAfterPoint = (number) => {
  return number.toFixed(2).replace('.00', '');
};
