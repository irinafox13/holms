/** Класс для управления бургер-меню. */
class BurgerMenu {
  /**
   * Конструктор класса.
   *
   * @param {HTMLElement} menuElement Элемент меню.
   */
  constructor(menuElement) {
    this.menuElement = menuElement;
    this.header = this.menuElement.previousElementSibling;
    this.burgerButtons = this.header.querySelectorAll('.js-burger-button-menu');
    this.scrollbarWidth = 0;

    this.bindEventListeners();
  }

  /**
   * Привязка обработчиков событий к кнопкам.
   *
   * @returns {void}
   */
  bindEventListeners() {
    this.burgerButtons.forEach((button) => {
      button.addEventListener('click', this.toggleMenu.bind(this));
    });

    // Закрываем меню при клике на ссылки навигации
    const navLinks = this.menuElement.querySelectorAll('.burger-menu__list a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Закрываем меню при нажатии ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.header.classList.contains('is-menu-open')) {
        this.closeMenu();
      }
    });
  }

  /**
   * Переключение видимости мобильного меню.
   *
   * @returns {void}
   */
  toggleMenu() {
    const isMenuOpen = this.header.classList.toggle('is-menu-open');
    this.toggleScrollLock(isMenuOpen);
    this.toggleMenuVisibility(isMenuOpen);
  }

  /**
   * Закрытие мобильного меню.
   *
   * @returns {void}
   */
  closeMenu() {
    this.header.classList.remove('is-menu-open');
    this.toggleScrollLock(false);
    this.toggleMenuVisibility(false);
  }

  /**
   * Блокировка/разблокировка прокрутки страницы.
   *
   * @param {boolean} isMenuOpen Состояние меню (открыто/закрыто).
   * @returns {void}
   */
  toggleScrollLock(isMenuOpen) {
    document.documentElement.classList.toggle('prevent-scroll', isMenuOpen);
  }

  /**
   * Переключение видимости меню.
   *
   * @param {boolean} isMenuOpen Состояние меню (открыто/закрыто).
   * @returns {void}
   */
  toggleMenuVisibility(isMenuOpen) {
    this.menuElement.classList.toggle('is-open', isMenuOpen);
  }
}

document.querySelectorAll('.js-burger-menu').forEach((menu) => new BurgerMenu(menu));
