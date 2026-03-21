/**
 * Модуль для работы с таймерами, например, обратным отсчётом.
 */
/**
 * Запускает обратный отсчёт и обновляет текст в указанном DOM-узле.
 * @param {HTMLElement} timerNode - Элемент DOM, в котором отображается таймер.
 * @param {number} [duration=60] - Продолжительность отсчёта в секундах (по умолчанию 60).
 * @param {function} [onComplete] - Функция, вызываемая по окончании отсчёта.
 */
export function startTimer(timerNode, duration = 60, onComplete = null) {
  if (!timerNode) return
  let timeLeft = duration
  timerNode.textContent = formatTime(timeLeft)
  const intervalId = setInterval(() => {
    timeLeft -= 1
    timerNode.textContent = formatTime(timeLeft)
    if (timeLeft <= 0) {
      clearInterval(intervalId)
      if (typeof onComplete === 'function') {
        onComplete()
      }
    }
  }, 1000)
}
/**
 * Форматирует число секунд в формат "MM:SS".
 * @param {number} seconds - Количество секунд.
 * @returns {string} Отформатированная строка времени.
 */
function formatTime(seconds) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}