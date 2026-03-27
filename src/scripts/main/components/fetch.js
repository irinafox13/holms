import {mockHelper} from '@main/helpers/mock-helper';
import {example} from '@mocker/index';
import axios from 'axios';

/**
 * Класс для получения данных и обновления содержимого элемента.
 */
export class DataFetcher {
  /**
   * Создает экземпляр DataFetcher.
   * @param {HTMLElement} el - Элемент, с которым будет работать DataFetcher.
   */
  constructor(el) {
    this.el = el;
    this.url = this.el.dataset.url;
    mockHelper(example, () => this.fetchData());
  }

  /**
   * Асинхронно получает данные с указанного URL и обновляет содержимое элемента.
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async fetchData() {
    try {
      const response = await axios.get('/api/example');
      if (response.statusText !== 'OK') throw new Error('Ошибка сети: ' + response.status);
      const data = await response.data;
      this.el.textContent = data.title;
    } catch (err) {
      console.log(err);
    }
  }
}

document.querySelectorAll('.js-dinamic-title').forEach((el) => new DataFetcher(el));
