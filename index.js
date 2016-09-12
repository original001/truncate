const symbolsArray = ' !"#$%&\'()*+,-–./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ЁАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяё'.split('');

const initializeSymbols = _.memoize((container) => {
  container = container || document.body;
  const symbolsEnum = {};

  const span = document.createElement('span');
  let count = 0;
  let sum = 0;
  container.appendChild(span);
  symbolsArray.forEach(symbol => {
    span.innerHTML = symbol !== ' ' ? symbol : '&nbsp;';
    const width = span.getBoundingClientRect().right - span.getBoundingClientRect().left;
    symbolsEnum[symbol] = _.round(width, 2);
    sum += width;
    count++;
  });
  container.removeChild(span);
  symbolsEnum.avg = _.round(sum/count, 2);
  return symbolsEnum;
}, container => container && container.className);

const TOKEN = '...';

/*
 * options
 * - string {String} Строка для подрезки
 * - width {Number} Какая в итоге должна быть ширина
 * - container {DOMElement} для взятия пробы
 * - token {String} Разделитель
 */

const truncate = (options) => {
  const token = options.token || TOKEN;
  const symbols = initializeSymbols(options.container);

  const tokenWidth = Array.prototype.reduce.call(token, (a, b) => {return a + symbols[b]}, 0);
  const widthBefore = options.width / 2;
  const widthAfter = options.width / 2 - tokenWidth;
  let phraseBefore = '';
  let phraseAfter = '';
  let currentSum = 0;
  const splittedString = options.string.split('');

  const result = splittedString.every(symbol => {
    currentSum += symbols[symbol] || symbols.avg;
    if (currentSum >= widthBefore) {
      if (currentSum < options.width) {
        phraseAfter += symbol;
        return true;
      } else {
        phraseBefore += token;
        currentSum = 0;
        phraseAfter = '';
        return false;
      }
    } else {
      phraseBefore += symbol;
      return true;
    }
  });

  !result && splittedString.reverse().every(symbol => {
    currentSum += symbols[symbol] || symbols.avg;
    if (currentSum >= widthAfter) {
      return false;
    }
    phraseAfter = symbol + phraseAfter;
    return true;
  });

  return phraseBefore + phraseAfter
};
