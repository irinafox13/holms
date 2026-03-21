import { App as StdApp } from '@std/app'

/** Основной класс приложения. */
export class App extends StdApp {
  /**
 * Конструктор класса.
 *
 * @param {object} config Конфиг приложения.
 */
  constructor(config = {}) {
    super(config)
  }

  /**
 * Запуск приложения.
 *
 * @returns {void}
 */
  run() {}
}
