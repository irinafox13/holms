import noUiSlider from 'nouislider';

/**
 * Универсальный компонент Range
 */
export class RangeComponent {
  constructor(element) {
    this.element = element;

    // Получаем элементы
    this.sliderElement = this.element.querySelector('[data-range-slider]');
    this.valueElement = this.element.querySelector('[data-range-value]');

    // Получаем тип компонента
    this.type = this.element.dataset.rangeType;

    // Получаем настройки из data-атрибутов слайдера
    this.config = {
      min: parseFloat(this.sliderElement.dataset.min),
      max: parseFloat(this.sliderElement.dataset.max),
      start: parseFloat(this.sliderElement.dataset.start),
      step: parseFloat(this.sliderElement.dataset.step) || 1,
    };

    // Инициализируем компонент
    this.init();
  }

  /**
   * Форматирование с пробелами
   */
  formatNumberWithSpaces(number) {
    if (number === undefined || number === null) return '';
    const numStr = String(Math.round(number));
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Обновление отображения значения
   */
  updateDisplay(value) {
    if (this.valueElement) {
      const formattedValue = this.formatNumberWithSpaces(value);
      this.valueElement.textContent = formattedValue;
    }
  }

  /**
   * Обработчик изменения значения
   */
  onUpdate(values) {
    const value = parseFloat(values[0]);
    this.updateDisplay(value);

    // Генерируем кастомное событие
    this.element.dispatchEvent(
      new CustomEvent('range:update', {
        detail: {
          type: this.type,
          value: value,
          formattedValue: this.formatNumberWithSpaces(value),
          config: this.config,
        },
        bubbles: true,
      }),
    );
  }

  /**
   * Инициализация слайдера
   */
  initSlider() {
    if (this.sliderElement && noUiSlider) {
      if (this.sliderElement.noUiSlider) {
        return;
      }

      noUiSlider.create(this.sliderElement, {
        start: [this.config.start],
        connect: [true, false],
        range: {
          min: this.config.min,
          max: this.config.max,
        },
        step: this.config.step,
        format: {
          to: (value) => value.toFixed(this.config.step < 1 ? 1 : 0),
          from: (value) => parseFloat(value),
        },
      });

      // Добавляем обработчик события
      this.sliderElement.noUiSlider.on('update', (values) => {
        this.onUpdate(values);
      });
    }
  }

  /**
   * Установка нового значения программно
   */
  setValue(value) {
    if (this.sliderElement && this.sliderElement.noUiSlider) {
      const clampedValue = Math.min(this.config.max, Math.max(this.config.min, value));
      this.sliderElement.noUiSlider.set(clampedValue);
    }
  }

  /**
   * Получение текущего значения
   */
  getValue() {
    if (this.sliderElement && this.sliderElement.noUiSlider) {
      const value = this.sliderElement.noUiSlider.get();
      return parseFloat(value);
    }
    return null;
  }

  /**
   * Инициализация компонента
   */
  init() {
    this.initSlider();
  }
}

export class RangeComponentFactory {
  /**
   * Создает компоненты для всех элементов с указанным селектором
   */
  static create(selector) {
    const elements = document.querySelectorAll(selector);
    const components = [];

    elements.forEach((element) => {
      // Проверяем, не инициализирован ли уже компонент
      if (!element._rangeComponent) {
        const component = new RangeComponent(element);
        element._rangeComponent = component;
        components.push(component);
      } else {
        components.push(element._rangeComponent);
      }
    });

    return components;
  }

  /**
   * Получить компонент для конкретного элемента
   */
  static get(element) {
    return element._rangeComponent || null;
  }
}

RangeComponentFactory.create('.range-component');
