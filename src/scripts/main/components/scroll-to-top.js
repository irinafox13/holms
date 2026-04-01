/**
 * Класс для реализации плавной прокрутки страницы к началу
 * @class
 */
class ScrollToTop {
  /**
   * Создает экземпляр ScrollToTop
   * @constructor
   * @param {HTMLElement} button - HTML-элемент кнопки для прокрутки к началу
   */
  constructor(button) {
    /**
     * @type {HTMLElement}
     */
    this.button = button;

    this.bindEventListeners();
  }

  /**
   * Привязывает обработчики событий к кнопке
   */
  bindEventListeners() {
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });

    // Добавляем обработчик для клавиши Enter
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });

    // Добавляем обработчик для прокрутки страницы
    window.addEventListener('scroll', () => this.handleScroll());
  }

  /**
   * Выполняет плавную прокрутку страницы к началу
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Обрабатывает событие прокрутки страницы
   */
  handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = scrollPosition + windowHeight >= documentHeight - 1;

    // Показываем кнопку только если прокрутка > 200px И не в конце страницы
    if (scrollPosition > 200 && !isAtBottom) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }
}

/**
 * Инициализирует кнопки прокрутки к началу страницы
 */
document.querySelectorAll('.js-scroll-to-top').forEach((node) => new ScrollToTop(node));
