class ScrollHeader {
  constructor() {
    this.options = {
      headerSelector: '.js-header',
      fixedClass: 'is-fixed',
      offset: 0,
      throttleDelay: 10,
    };

    this.header = document.querySelector(this.options.headerSelector);
    this.isFixed = false;
    this.throttleTimer = null;
    this.isScrollingPrevented = false;
    this.handleScroll = this.handleScroll.bind(this);

    this.init();
  }

  /**
   * Инициализация: проверяем элемент и добавляем слушатели
   */
  init() {
    if (!this.header) {
      return;
    }

    // Получаем реальную высоту хедера для корректного padding
    this.updateHeaderHeight();

    // Проверяем начальное положение страницы
    this.checkScroll();

    // Добавляем слушатель скролла с throttle
    window.addEventListener('scroll', this.handleScroll);

    // Опционально: слушатель для resize (пересчет offset и высоты)
    window.addEventListener('resize', () => {
      this.updateHeaderHeight();
      this.checkScroll();
    });
  }

  /**
   * Получает актуальную высоту хедера
   */
  updateHeaderHeight() {
    if (this.header) {
      this.headerHeight = this.header.offsetHeight;
    }
  }

  /**
   * Проверяет текущую позицию скролла и обновляет класс
   */
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeFixed = scrollPosition > this.options.offset;

    if (shouldBeFixed && !this.isFixed) {
      this.addFixedClass();
    } else if (!shouldBeFixed && this.isFixed) {
      this.removeFixedClass();
    }
  }

  /**
   * Добавляет класс фиксации
   */
  addFixedClass() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    this.header.classList.add(this.options.fixedClass);
    document.body.style.paddingTop = `${this.headerHeight}px`;

    // Компенсируем скачок скролла
    if (document.documentElement.scrollTop !== scrollPosition) {
      document.documentElement.scrollTop = scrollPosition;
      document.body.scrollTop = scrollPosition;
    }

    this.isFixed = true;
  }

  /**
   * Удаляет класс фиксации
   */
  removeFixedClass() {
    // Сохраняем текущую позицию скролла
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.paddingTop = '0';
    this.header.classList.remove(this.options.fixedClass);

    if (scrollPosition > 0) {
      const newScrollPosition = Math.max(0, scrollPosition - this.headerHeight);
      document.documentElement.scrollTop = newScrollPosition;
      document.body.scrollTop = newScrollPosition;
    }

    this.isFixed = false;
  }

  /**
   * Обработчик скролла с throttle для оптимизации производительности
   */
  handleScroll() {
    if (this.throttleTimer) return;

    this.throttleTimer = setTimeout(() => {
      this.checkScroll();
      this.throttleTimer = null;
    }, this.options.throttleDelay);
  }

  /**
   * Уничтожение: удаляем слушатели и очищаем
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkScroll);

    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
    }

    this.removeFixedClass();
  }
}

new ScrollHeader();
