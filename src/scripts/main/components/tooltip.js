import tippy from 'tippy.js'

/** 
 * Компонент тултип.
 */
export class Tooltip {
  /**
     * Создает компонент тултипа.
     *
     * @param {HTMLElement} el - DOM элемент.
     */
  constructor(el) {
    this.el = el
    this.checkHeight = this.el.dataset.checkHeight || false
    const content = this.getTooltipContent()

    this.tippy = tippy(this.el, {
      theme: this.el.dataset.theme,
      content: content,
      allowHTML: true,
      arrow: true,
      touch: !!this.el.dataset.touch || false,
      maxWidth: 385,
      placement: this.el.dataset.placement || 'top',
      popperOptions: {
        strategy: 'fixed',
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'right', 'left'],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true,
              tether: false,
            },
          },
        ],
      },
      onShow: () => {
        if (this.checkHeight) {
          if (this.el.clientHeight >= this.el.scrollHeight) {
            return false
          }
        }
      }
    })

    this.bindEventListeners()
  }

  /**
     * Отслеживание событий.
     *
     * @returns {void}
     */
  bindEventListeners() {
    document.querySelector('body').addEventListener('scroll', () => {
      this.hideTooltipOnScroll()
    })

    this.el.addEventListener('updateTooltipContent', () => {
      this.updateTooltipContent()
    })
  }

  /**
    * Получает содержимое для тултипа.
    *
    * Извлекает HTML-содержимое из элемента и формирует его на основе
    * данных атрибутов элемента.
    *
    * @returns {string} Сформированное HTML-содержимое для тултипа.
    */
  getTooltipContent() {
    const contentHtml = this.el.querySelector('.js-tooltip-content')?.innerHTML
    const title = this.el.dataset.title ? `<h5>${this.el.dataset.title}</h5>` : ''
    const text = this.el.dataset.text ? `<p>${this.el.dataset.text}</p>` : ''
    let content = `${title}${text}`

    if (contentHtml) {
      content = contentHtml
    }
    return content
  }

  /**
     * Обновить содержимое подсказки.
     *
     * Устанавливает новое содержимое для тултипа, извлекая его
     * из элемента.
     *
     * @returns {void}
     */
  updateTooltipContent() {
    const content = this.getTooltipContent()
    this.tippy.setContent(content)
  }

  /**
     * Скрываем тултип при прокрутке.
     *
     * @returns {void}
     */
  hideTooltipOnScroll() {
    this.tippy.hide()
  }
}

document.querySelectorAll('.js-tooltip').forEach((el) => new Tooltip(el))
