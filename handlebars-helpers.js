import {generateResponsivePicture} from './src/scripts/main/helpers/picture-helper.js';

export const helpers = {
  upperCase: (str) => str.toUpperCase(),
  getLengthArray: (arr) => arr.length,
  repeat: (n, options) => {
    let result = '';
    for (let i = 0; i < n; i++) {
      result += options.fn(this, {
        data: {
          index: i,
          first: i === 0,
          last: i === n - 1,
        },
      });
    }
    return result;
  },
  formatNumber: (number) => {
    if (number === undefined || number === null) return '';
    const numStr = String(number);
    // Форматируем с пробелами каждые 3 цифры
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  },
  ifCond: (v1, operator, v2, options) => {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
  responsivePicture: generateResponsivePicture,
};
