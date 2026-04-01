/** Класс для управления бургер-меню. */
class BurgerMenu {
  constructor(menuElement) {
    this.menuElement = menuElement;
    this.header = this.menuElement.previousElementSibling;
    this.burgerButtons = this.header.querySelectorAll('.js-burger-button-menu');

    this.bindEventListeners();
  }

  bindEventListeners() {
    this.burgerButtons.forEach((button) => {
      button.addEventListener('click', this.toggleMenu.bind(this));
    });

    const navLinks = this.menuElement.querySelectorAll('.burger-menu__list a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.header.classList.contains('is-menu-open')) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isMenuOpen = this.header.classList.toggle('is-menu-open');
    this.toggleScrollLock(isMenuOpen);
    this.toggleMenuVisibility(isMenuOpen);
  }

  closeMenu() {
    this.header.classList.remove('is-menu-open');
    this.toggleScrollLock(false);
    this.toggleMenuVisibility(false);
  }

  toggleScrollLock(isMenuOpen) {
    if (isMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // Устанавливаем CSS переменную
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.documentElement.classList.add('prevent-scroll');
    } else {
      setTimeout(() => {
        document.documentElement.classList.remove('prevent-scroll');
        document.documentElement.style.removeProperty('--scrollbar-width');
      }, 550);
    }
  }

  toggleMenuVisibility(isMenuOpen) {
    this.menuElement.classList.toggle('is-open', isMenuOpen);
  }
}

document.querySelectorAll('.js-burger-menu').forEach((menu) => new BurgerMenu(menu));
