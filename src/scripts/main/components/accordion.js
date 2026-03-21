import { getBtnFromTarget } from '@main/helpers/get-btn-from-target'
import { ACCORDION_ANIMATION_DURATION } from '@main/helpers/consts'

/**
 * Компонент аккордеона.
 */
export class Accordion {
  /**
   * Создает компонент аккордеона.
   *
   * @param {HTMLElement} accordion Элемент аккордеона.
   */
  constructor(accordion) {
    this.accordion = accordion
    this.bindEventListeners()
  }

  /**
   * Отслеживание событий.
   *
   * @returns {void}
   */
  bindEventListeners() {
    this.accordion.addEventListener('click', (e) => {
      const accordionHeader = getBtnFromTarget(e.target, 'js-accordion-header')
      if (accordionHeader) {
        this.handleAccordionClick(e, accordionHeader)
      }
    })
  }

  /**
   * Обработка клика по заголовку аккордеона.
   *
   * @param {Event} e Событие, происходящее при клике на аккордеон.
   * @param {HTMLElement} accordionHeader Заголовок аккордеона.
   * @returns {void}
   */
  handleAccordionClick(e, accordionHeader) {
    e.preventDefault()
    const currentAccordion = accordionHeader.parentElement
    const currentContent = currentAccordion.querySelector('.js-accordion-body')

    // Закрытие всех других аккордеонов
    this.closeOtherAccordions(currentAccordion)

    // Переключение текущего аккордеона
    const isOpen = this.toggleAccordion(currentAccordion)
    this.setAccordionContentHeight(currentContent, isOpen)
  }

  /**
   * Переключение класса "opened" у аккордеона.
   *
   * @param {HTMLElement} accordionItem Аккордеон.
   * @returns {boolean} Состояние аккордеона (открыт/закрыт).
   */
  toggleAccordion(accordionItem) {
    return accordionItem.classList.toggle('opened')
  }

  /**
   * Установка высоты контента аккордеона.
   *
   * @param {HTMLElement} content Элемент контента аккордеона.
   * @param {boolean} isOpen Состояние аккордеона (открыт/закрыт).
   * @returns {void}
   */
  setAccordionContentHeight(content, isOpen) {
    content.style.transition = `all ${ACCORDION_ANIMATION_DURATION}`
    content.style.maxHeight = isOpen ? `${content.scrollHeight}px` : '0'
  }

  /**
   * Закрытие всех других аккордеонов.
   *
   * @param {HTMLElement} currentItem Текущий аккордеон.
   * @returns {void}
   */
  closeOtherAccordions(currentItem) {
    const siblings = Array.from(currentItem.parentElement.children).filter(child => child !== currentItem)

    siblings.forEach(sibling => {
      if (sibling.classList.contains('opened')) {
        sibling.classList.remove('opened')
        const siblingContent = sibling.querySelector('.js-accordion-body')
        this.setAccordionContentHeight(siblingContent, false)
      }
    })
  }
}

document.querySelectorAll('.js-accordion').forEach(item => new Accordion(item))