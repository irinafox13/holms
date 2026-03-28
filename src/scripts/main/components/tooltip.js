import tippy from 'tippy.js';

const ARROW_SVG = `<svg width="48" height="8" viewBox="0 0 48 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.6086 1.69068C22.258 0.960134 22.9274 -5.11493e-07 24.0003 0C25.0732 5.11493e-07 
  25.7427 0.960135 26.392 1.69068L29.1362 4.7779C30.1906 5.96402 30.7177 6.55708 31.352 6.98262C31.9142 
  7.35975 32.5361 7.63903 33.1914 7.80863C33.9309 8.00001 34.413 8.00001 36 8.00001L12 8.00001C13.587 
  8.00001 14.0698 8.00001 14.8092 7.80863C15.4646 7.63903 16.0865 7.35975 16.6486 6.98262C17.2829 
  6.55708 17.8101 5.96402 18.8644 4.7779L21.6086 1.69068Z" fill="white" fill-opacity="0.2"/>
</svg>`;

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
    this.el = el;
    this.checkHeight = this.el.dataset.checkHeight || false;
    const content = this.getTooltipContent();

    this.tippy = tippy(this.el, {
      theme: this.el.dataset.theme,
      content: content,
      allowHTML: true,
      arrow: ARROW_SVG,
      touch: !!this.el.dataset.touch || true,
      maxWidth: 385,
      placement: this.el.dataset.placement || 'bottom',
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
            return false;
          }
        }
      },
    });

    this.bindEventListeners();
  }

  /**
   * Отслеживание событий.
   *
   * @returns {void}
   */
  bindEventListeners() {
    document.querySelector('body').addEventListener('scroll', () => {
      this.hideTooltipOnScroll();
    });

    this.el.addEventListener('updateTooltipContent', () => {
      this.updateTooltipContent();
    });
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
    const contentHtml = this.el.querySelector('.js-tooltip-content')?.innerHTML;
    const title = this.el.dataset.title ? `<h5>${this.el.dataset.title}</h5>` : '';
    const text = this.el.dataset.text ? `<p>${this.el.dataset.text}</p>` : '';
    let content = `${title}${text}`;

    if (contentHtml) {
      content = contentHtml;
    }
    return content;
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
    const content = this.getTooltipContent();
    this.tippy.setContent(content);
  }

  /**
   * Скрываем тултип при прокрутке.
   *
   * @returns {void}
   */
  hideTooltipOnScroll() {
    this.tippy.hide();
  }
}

document.querySelectorAll('.js-tooltip').forEach((el) => new Tooltip(el));
