import {TIMER_INTERVAL} from '@main/helpers/consts';

/**
 * Запускает таймер, который обновляет текстовое содержимое таймера каждую секунду.
 *
 * @return {void} Ничего не возвращается, таймер обновляется на месте.
 */
export const startTimer = (timerNode) => {
  let time = +Number(timerNode.dataset.time);
  const redirectUrl = timerNode.dataset.redirectUrl;
  const timer = setInterval(() => {
    timerNode.textContent = time <= 0 ? clearInterval(timer) : time--;

    if (time <= 0) {
      window.location.href = redirectUrl;
    }
  }, TIMER_INTERVAL);
};
