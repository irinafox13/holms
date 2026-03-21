import { Input } from '@main/components/form/form-field/input'
import { Select } from '@main/components/form/form-field/select'
import { NumberInput } from '@main/components/form/form-field/number-input'
import { PasswordInput } from '@main/components/form/form-field/password-input'
import { FileInput } from '@main/components/form/form-field/file-input'
import { PhoneMask } from '@main/components/form/form-field/phone-input'

/**
 * Инициализирует компоненты формы внутри заданного элемента.
 *
 * @param {Element} container Контейнер, в котором производится инициализация.
 */
export function initFormFields(container) {
  if (!container || typeof container.querySelectorAll !== 'function') return
  
  const typeMap = {
    'select-one': Select,
    'select-multiple': Select,
    'password': PasswordInput,
    'file': FileInput,
  }

  container.querySelectorAll('.js-form-field').forEach((field) => {
    const input = field.querySelector('.js-form-field-input')
    if (!input) return

    if (input.classList.contains('js-form-field-input-number')) {
      new NumberInput({ container: field, input })
    } else if (input.classList.contains('js-phone-input')) {
      new PhoneMask(input)
    } else {
      const Component = typeMap[input.type] || Input
      new Component({ container: field, input })
    }
  })
}

// Инициализация при старте страницы
initFormFields(document)

// Подписка на кастомное событие для динамической инициализации
document.addEventListener('initFormFields', (event) => {
  const selector = event?.detail
  if (!selector) return

  const container = document.querySelector(selector)
  if (container) {
    initFormFields(container)
  }
})

window.addEventListener('load', () => {
  document.querySelectorAll('input[type="tel"]').forEach((input) => new PhoneMask(input))
})