/**
 * Класс для управления прокруткой страницы, добавляя или удаляя отступы,
 * чтобы избежать скачков при установке body свойства overflow: "hidden".
 */
export class ToggleScroll {
  /** Включает прокрутку и убирает отступ */
  static enable(modal) {
    const pagePosition = parseInt(document.body.dataset.position, 10) || 0
    // Убираем отступы и восстанавливаем позицию прокрутки
    document.body.style.top = ''
    document.body.style.paddingRight = '0px'
    document.body.classList.remove('prevent-scroll')
    if (modal) {
      modal.style.paddingRight = '0px'
    }
    window.scrollTo(0, pagePosition)
    document.body.removeAttribute('data-position')
  }

  /** Отключает прокрутку и добавляет отступ */
  static disable(modal) {
    const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`
    const pagePosition = window.scrollY
    // Устанавливаем отступы и сохраняем позицию прокрутки
    document.body.style.paddingRight = paddingOffset
    document.body.classList.add('prevent-scroll')
    document.body.dataset.position = pagePosition
    document.body.style.top = `-${pagePosition}px`
    if (modal) {
      modal.style.paddingRight = paddingOffset
    }
  }
}