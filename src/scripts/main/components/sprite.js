/** Компонент показа иконок из спрайта. */
class Sprite {
  /**
     * Конструктор класса.
     *
     * @param {HTMLElement} div Блок со спрайтом.
     */
  constructor(el) {
    this.el = el
    this.icons = [...this.el.getElementsByTagName('symbol')]
    this.makeSvg()
  }

  /**
     * Генерировать svg.
     *
     * @returns {void}
     */
  makeSvg() {
    this.icons.forEach((icon) => {
      this.el.insertAdjacentHTML('beforeend', "<svg><use href='#" + icon.id + "'/></svg>")
    })
  }
}

window.addEventListener('load', () => {
  document
    .querySelectorAll('.js-sprite')
    .forEach(el => new Sprite(el))
})
