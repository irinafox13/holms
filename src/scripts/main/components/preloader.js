class Preloader {
  constructor(options = {}) {
    // Элементы DOM
    this.preloaderElement = document.querySelector('.preloader');
    this.numberElement = document.querySelector('.js-preloader-number');
    this.progressbarElement = document.querySelector('.js-preloader-progressbar');
    this.headerElement = document.querySelector('.js-preloader');

    // Настройки
    this.options = {
      minDisplayTime: 1000, // Минимальное время отображения (мс)
      animationDuration: 100, // Длительность анимации между процентами (мс)
      startPercent: 0, // Начальный процент
      endPercent: 100, // Конечный процент
      autoStart: true, // Автоматический запуск
      onComplete: null, // Коллбек при завершении
      ...options,
    };

    // Состояние
    this.currentPercent = this.options.startPercent;
    this.isComplete = false;
    this.animationFrame = null;
    this.startTime = null;
    this.resourcesLoaded = false;
    this.minTimeReached = false;

    // Привязка методов
    this.updateProgress = this.updateProgress.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.checkCompletion = this.checkCompletion.bind(this);

    // Автозапуск
    if (this.options.autoStart) {
      this.init();
    }
  }

  /**
   * Инициализация прелоадера
   */
  init() {
    // Сбрасываем состояние
    this.currentPercent = this.options.startPercent;
    this.isComplete = false;
    this.resourcesLoaded = false;
    this.minTimeReached = false;

    // Обновляем отображение
    this.updateDisplay(this.currentPercent);

    // Запускаем таймер минимального отображения
    setTimeout(() => {
      this.minTimeReached = true;
      this.checkCompletion();
    }, this.options.minDisplayTime);

    // Слушаем событие загрузки страницы
    if (document.readyState === 'complete') {
      this.handleLoad();
    } else {
      window.addEventListener('load', this.handleLoad);
    }
  }

  /**
   * Обработка полной загрузки страницы
   */
  handleLoad() {
    this.resourcesLoaded = true;
    this.checkCompletion();
  }

  /**
   * Проверка условий завершения
   */
  checkCompletion() {
    if (!this.isComplete && this.resourcesLoaded && this.minTimeReached) {
      this.complete();
    }
  }

  /**
   * Завершение прелоадера
   */
  complete() {
    if (this.isComplete) return;

    this.isComplete = true;

    // Анимируем до 100%
    this.animateTo(this.options.endPercent, () => {
      // Скрываем прелоадер
      this.hide();

      // Вызываем коллбек
      if (this.options.onComplete && typeof this.options.onComplete === 'function') {
        this.options.onComplete();
      }
    });
  }

  /**
   * Анимация прогресса от текущего значения к целевому
   */
  animateTo(targetPercent, callback) {
    const startPercent = this.currentPercent;
    const difference = targetPercent - startPercent;
    const startTime = performance.now();
    const duration = this.options.animationDuration * Math.abs(difference);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // easeOutCubic для плавной анимации
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newPercent = Math.round(startPercent + difference * easeProgress);

      this.updateProgress(newPercent);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.updateProgress(targetPercent);
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Обновление прогресса (внешний вызов)
   */
  updateProgress(percent) {
    // Ограничиваем значение
    percent = Math.min(100, Math.max(0, percent));

    // Не даём уменьшаться
    if (percent < this.currentPercent) return;

    this.currentPercent = percent;
    this.updateDisplay(percent);

    // Если достигли 100% и ресурсы загружены
    if (percent === 100 && this.resourcesLoaded) {
      this.complete();
    }
  }

  /**
   * Обновление отображения
   */
  updateDisplay(percent) {
    // Обновляем цифру
    if (this.numberElement) {
      this.numberElement.textContent = percent;
    }

    // Обновляем прогресс-бар
    if (this.progressbarElement) {
      this.progressbarElement.style.width = `${percent}%`;
      this.progressbarElement.style.transform = `scaleX(${percent / 100})`;
      this.progressbarElement.style.transformOrigin = 'left';
    }
  }

  /**
   * Скрытие прелоадера
   */
  hide() {
    if (!this.preloaderElement) return;

    // Добавляем класс для анимации исчезновения
    this.preloaderElement.classList.add('preloader--hidden');

    // Ждём окончания анимации
    const onTransitionEnd = () => {
      this.preloaderElement.style.display = 'none';
      this.preloaderElement.removeEventListener('transitionend', onTransitionEnd);

      // Удаляем класс для возможного повторного использования
      this.preloaderElement.classList.remove('preloader--hidden');
    };

    this.preloaderElement.addEventListener('transitionend', onTransitionEnd);

    // Фолбэк, если transitionend не сработал
    setTimeout(() => {
      this.preloaderElement.style.display = 'none';
      this.preloaderElement.removeEventListener('transitionend', onTransitionEnd);
    }, 500);
  }

  /**
   * Показать прелоадер (для повторного использования)
   */
  show() {
    if (!this.preloaderElement) return;

    this.preloaderElement.style.display = 'flex';
    this.init();
  }

  /**
   * Загрузка с имитацией прогресса
   */
  startSimulation(duration = 2000) {
    const incrementInterval = duration / 100;
    let percent = this.currentPercent;

    const interval = setInterval(() => {
      if (percent < 99 && !this.resourcesLoaded) {
        percent++;
        this.updateProgress(percent);
      } else if (this.resourcesLoaded) {
        clearInterval(interval);
        this.complete();
      }
    }, incrementInterval);

    // Сохраняем interval для очистки при необходимости
    this.simulationInterval = interval;
  }

  /**
   * Остановка имитации
   */
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  /**
   * Отслеживание реальной загрузки изображений
   */
  trackImages() {
    const images = document.images;
    const totalImages = images.length;
    let loadedImages = 0;

    if (totalImages === 0) {
      this.handleLoad();
      return;
    }

    const imageLoaded = () => {
      loadedImages++;
      const percent = Math.floor((loadedImages / totalImages) * 100);
      this.updateProgress(percent);

      if (loadedImages === totalImages) {
        this.handleLoad();
      }
    };

    for (let img of images) {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded);
      }
    }
  }

  /**
   * Деструктор для очистки
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.stopSimulation();

    window.removeEventListener('load', this.handleLoad);

    if (this.preloaderElement) {
      this.preloaderElement.style.display = '';
    }
  }
}

const preloader = new Preloader({
  minDisplayTime: 1500, // Показываем минимум 1.5 секунды
  animationDuration: 50, // Быстрая анимация
  onComplete: () => {
    console.log('Прелоадер скрыт, контент загружен');
    // Здесь можно запустить дополнительные анимации или инициализировать другие скрипты
  },
});

// Запускаем имитацию прогресса
preloader.startSimulation(2000);
