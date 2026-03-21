import KeenSlider from 'keen-slider'

/**
 * Класс для создания линейного слайдера.
 */
class LineSlider {
  /**
   * Создает экземпляр LineSlider.
   *
   * @param {HTMLElement} slider Элемент контейнера слайдера.
   */
  constructor(slider) {
    this.slider = slider

    this.createSlider()
  }

  /**
   * Инициализирует слайдер с заданными настройками.
   *
   * @returns {void}
   */
  createSlider() {
    new KeenSlider(this.slider, {
      slides: {
        perView: 'auto',
      },
    })
  }
}

document.querySelectorAll('.js-line-slider').forEach(slider => new LineSlider(slider))