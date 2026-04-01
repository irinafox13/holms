/**
 * Проверить таргет клика на нужный класс.
 *
 * @param {EventTarget} target Элемент, по которому кликнули.
 * @param {string} className Имя класса для проверки.
 *
 * @returns {HTMLElement || null} btn Вернуть кнопку или ничего, если цель не та.
 */
export const getBtnFromTarget = (target, className) => {
  let btn = null;
  if (target.classList.contains(className)) {
    btn = target;
  } else {
    btn = target.closest('.' + className);
  }
  return btn;
};
