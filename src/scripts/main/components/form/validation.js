/**
 * Утилиты валидации для полей формы.
 */

/**
 * Проверяет валидность значения по регулярному выражению или атрибуту pattern.
 * @param {HTMLInputElement} input - Элемент ввода.
 * @returns {boolean} True, если ввод валиден согласно паттерну.
 */
export function isValidPattern(input) {
  if (!input.required && !input.value) return true;
  const patternData = input.pattern || input.dataset.pattern;
  try {
    return new RegExp(patternData).test(input.value);
  } catch (error) {
    console.warn(error);
    return true;
  }
}

/**
 * Проверяет валидность ввода номера телефона.
 * @param {HTMLInputElement} phoneInput - Элемент ввода телефона.
 * @param {number} maxLength - Ожидаемая длина номера телефона.
 * @returns {boolean} True, если номер телефона валиден.
 */
export function isValidPhone(phoneInput, maxLength) {
  return !phoneInput.required || phoneInput.value.length === maxLength;
}

/**
 * Проверяет валидность ввода электронной почты.
 * @param {HTMLInputElement} mailInput - Элемент ввода электронной почты.
 * @param {RegExp} emailRegex - Регулярное выражение для проверки почты.
 * @returns {boolean} True, если почта валидна.
 */
export function isValidMail(mailInput, emailRegex) {
  return !mailInput.required || emailRegex.test(mailInput.value);
}

/**
 * Проверяет валидность ввода числа с учетом минимальных и максимальных значений.
 * @param {HTMLInputElement} numberInput - Элемент ввода числа.
 * @param {RegExp} numberRegex - Регулярное выражение для проверки числа.
 * @returns {boolean} True, если число валидно.
 */
export function isValidNumber(numberInput, numberRegex) {
  if (!numberInput.required && !numberInput.value) return true;
  if (numberInput.min && numberInput.max) {
    const value = +numberInput.value;
    if (value < +numberInput.min || value > +numberInput.max) return false;
  }
  return numberRegex.test(numberInput.value);
}

/**
 * Проверка валидности checkbox.
 *
 * @param {HTMLInputElement} checkboxInput Инпут почты.
 * @returns {boolean} Валидность checkbox.
 */
export function isValidCheckbox(checkboxInput) {
  return checkboxInput.checked;
}

/**
 * Проверяет, что длина значения ввода находится в пределах min и max.
 * @param {HTMLInputElement} input - Элемент ввода.
 * @returns {boolean} True, если длина валидна.
 */
export function checkMinMaxLen(input) {
  if (!input.required && !input.value) return true;
  const length = input.value.length;
  if (input.maxLength > 0 && length > input.maxLength) return false;
  if (input.minLength > 0 && length < input.minLength) return false;
  return true;
}

/**
 * Проверяет валидность значения поля с именем.
 * @param {HTMLInputElement} nameInput - Элемент ввода имени.
 * @param {RegExp} nameRegex - Регулярное выражение для проверки имени.
 * @returns {boolean} True, если имя валидно.
 */
export function isValidName(nameInput, nameRegex) {
  if (!nameInput.required && !nameInput.value) return true;
  nameInput.value = nameInput.value.trim();
  return nameRegex.test(nameInput.value);
}

/**
 * Проверяет, совпадают ли пароли и соответствуют ли они критериям.
 * @param {HTMLInputElement} passwordInput - Элемент ввода пароля.
 * @returns {boolean} True, если пароли валидны.
 */
export function isValidPasswords(passwordInput) {
  if (!passwordInput.required && !passwordInput.value) return true;
  const passwordGroup = passwordInput.closest('.js-password-group');
  if (!passwordGroup) return !!passwordInput.value;

  const inputs = passwordGroup.querySelectorAll('input');
  const [password1, password2] = inputs;

  if (!password1?.value || !password2?.value) return true;

  const passwordGroupError = passwordGroup.querySelector('.js-caption-error');
  const fields = passwordGroup.querySelectorAll('.js-form-field');

  if (password1.value !== password2.value) {
    setPasswordFieldsError(fields, 'Пароли не совпадают', passwordGroupError);
    return false;
  }

  clearPasswordFieldsError(fields, passwordGroupError);
  return true;
}

/**
 * Устанавливает ошибку для полей пароля.
 * @private
 */
function setPasswordFieldsError(fields, message, groupError) {
  fields.forEach((field) => {
    field.classList.add('error');
    const errorNode = field.querySelector('.js-validation-error');
    if (errorNode) errorNode.innerHTML = '';
  });
  if (groupError) groupError.innerHTML = message;
}

/**
 * Очищает ошибку для полей пароля.
 * @private
 */
function clearPasswordFieldsError(fields, groupError) {
  fields.forEach((field) => {
    field.classList.remove('error');
  });
  if (groupError) groupError.innerHTML = '';
}

/**
 * Проверяет, соответствует ли пароль требованиям по длине и символам.
 * @param {HTMLInputElement} passwordInput - Элемент ввода пароля.
 * @param {RegExp} numRegex - Регулярное выражение для проверки наличия цифр в пароле.
 * @param {RegExp} passwordRegex - Регулярное выражение для проверки сложности пароля.
 * @param {number} passwordMinLength - Минимальная длина пароля.
 * @returns {boolean} True, если пароль валиден.
 */
export function isValidPasswordByLetter(passwordInput, numRegex, passwordRegex, passwordMinLength) {
  if (!passwordInput.required && !passwordInput.value) return true;
  if (passwordInput.classList.contains('js-current-password')) return true;

  const password = passwordInput.value;
  const errorField = passwordInput.closest('.js-form-field')?.querySelector('.js-validation-error');

  const checks = [
    numRegex.test(password),
    passwordRegex.test(password),
    password !== password.toLowerCase(),
    password.length >= passwordMinLength,
  ];

  const result = checks.every((check) => check);

  if (errorField) {
    errorField.innerHTML = result ? '' : 'Пароль должен содержать не менее 8 знаков и иметь заглавную букву и цифру';
  }

  return result;
}
