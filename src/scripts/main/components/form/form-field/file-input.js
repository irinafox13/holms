import { Input } from '@main/components/form/form-field/input'
import { getFormattedFileSize } from '@main/helpers/get-formatted-file-size'

/** Компонент выбора файла. */
export class FileInput extends Input {
  /**
   * Создает компонент выбора файла.
   *
   * @param {object} props Параметры компонента.
   * @param {HTMLElement} props.container Родительский элемент.
   * @param {HTMLInputElement} props.input Элемент ввода.
   */
  constructor(props) {
    super(props)
    this.findElements()
  }

  /**
   * Ищет элементы.
   *
   * @returns {void}
   */
  findElements() {
    this.fileNameCaptionNode = this.el.querySelector('.js-form-field-file-caption')
    this.deleteInput = this.el.querySelector('.js-form-field-delete')
  }

  /**
   * Инициализация евентов.
   *
   * @returns {void}
   */
  bindEventListeners() {
    super.bindEventListeners()
    this.handleChange = this.onChange.bind(this)
    this.handleDelete = this.deleteFile.bind(this)
    
    this.input.addEventListener('change', this.handleChange)

    // Устанавливаем обработчик клика только на родительский элемент
    this.el.addEventListener('click', (e) => {
      const deleteButton = e.target.classList.contains('js-file-delete')
        ? e.target
        : e.target.closest('.js-file-delete')
      
      if (deleteButton) {
        this.handleDelete(e)
      }
    })

    this.input.addEventListener('setFileValue', (e) => {
      this.setCaption(e.detail.name, e.detail.size)
      this.el.classList.add('filled')
    })
  }

  /**
   * Коллбек, который обрабатывает выбор файла.
   *
   * @returns {void}
   */
  onChange() {
    const files = this.input.files
    
    if (files.length > 0) {
      // Выбран новый файл
      const file = files[0]
      this.currentFile = file
      this.setCaption(file.name, getFormattedFileSize(file.size))
      this.updateDeleteInput('')
      this.el.classList.add('filled')
    } else {
      // input.files пуст - скорее всего нажата "отмена"
      this.handleFileCancel()
    }
  }

  /**
   * Обрабатывает отмену выбора файла.
   * @returns {void}
   */
  handleFileCancel() {
    if (this.currentFile) {
      // Восстанавливаем предыдущее состояние
      this.setCaption(this.currentFile.name, getFormattedFileSize(this.currentFile.size))
      this.el.classList.add('filled')
      this.updateDeleteInput('')
    } else {
      // Нет текущего файла — чистим
      this.setCaption('', '')
      this.el.classList.remove('filled')
      this.updateDeleteInput('Y')
    }
  }

  /**
   * Обновляет значение скрытого инпута удаления.
   * @param {string} value - Значение для установки.
   * @returns {void}
   */
  updateDeleteInput(value) {
    if (this.deleteInput) {
      this.deleteInput.value = value
    }
  }

  /**
   * Установить имя файла и размер.
   *
   * @param {string} name - Имя файла.
   * @param {string} size - Размер файла.
   * @returns {void}
   */
  setCaption(name, size) {
    this.fileNameCaptionNode.innerHTML = name ? `${name} <span>${size}</span>` : ''
  }

  /**
   * Получить значение файла.
   *
   * @returns {File|null} Файл или null, если файл не выбран.
   */
  getValue() {
    return this.input.files[0] || null
  }

  /**
   * Удаляет выбранный файл из поля ввода файла.
   *
   * @param {Event} e - Объект события, вызванный нажатием кнопки удаления.
   * @returns {void}
   */
  deleteFile(e) {
    e.stopPropagation()
    const fileClearButton = e.target.classList.contains('js-file-delete')
      ? e.target
      : e.target.closest('.js-file-delete')
    const field = fileClearButton.closest('.js-form-field')
    const fileInput = field.querySelector('.js-form-field-input')

    this.updateFileState(field, fileInput)
  }

  /**
   * Обновляет состояние поля ввода файла.
   *
   * @param {HTMLElement} field - Родительский элемент поля ввода.
   * @param {HTMLInputElement} fileInput - Элемент ввода файла.
   * @returns {void}
   */
  updateFileState(field, fileInput) {
    field.classList.remove('filled')
    this.fileNameCaptionNode.innerText = ''
    fileInput.value = ''
    if (this.deleteInput) {
      this.deleteInput.value = 'Y'
    }
  }
}