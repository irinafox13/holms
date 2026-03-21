import { Input } from '@main/components/form/form-field/input'

/** Класс поля пароля. */
export class PasswordInput extends Input {
  /**
   * Конструктор класса.
   *
   * @param {object} props Параметры компонента.
   * @param {HTMLElement} props.container Родительский элемент.
   * @param {HTMLInputElement} props.input Элемент ввода.
   */
  constructor(props) {
    super(props)
    this.icon = this.el.querySelector('.js-password-icon')

    if (this.icon) {
      this.iconUse = this.icon.querySelector('use')
      this.iconHref = this.iconUse?.dataset.password
      this.iconTextHref = this.iconUse?.dataset.text

      // Используем стрелочную функцию для автоматической привязки контекста
      this.icon.addEventListener('click', this.togglePasswordVisibility)
    }
  }

  /**
   * Действия при вводе пароля.
   *
   * @param {Event} e Событие, происходящее при вводе в инпуте.
   * @returns {void}
   */
  onInput() {
    super.onInput()
  }

  /**
   * Переключить видимость пароля.
   *
   * @param {Event} e Событие, происходящее при клике.
   * @returns {void}
   */
  togglePasswordVisibility = (e) => {
    e.preventDefault()
    const isPasswordVisible = this.input.type === 'text'
    
    // Переключаем тип инпута и иконку
    this.input.type = isPasswordVisible ? 'password' : 'text'
    this.iconUse.setAttribute('href', isPasswordVisible ? this.iconHref : this.iconTextHref)
  }
}
