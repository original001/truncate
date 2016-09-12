var symbolsArray = ' !"#$%&\'()*+,-–./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ЁАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяё'.split('');

var initializeSymbols = _.memoize((etalon) => {
  var symbolsEnum = {};

  var span = document.createElement('span');
  var count = 0;
  var sum = 0;
  document.body.appendChild(span);
  symbolsArray.forEach(symbol => {
    span.innerHTML = symbol !== ' ' ? symbol : '&nbsp;';
    var width = span.getBoundingClientRect().right - span.getBoundingClientRect().left;
    symbolsEnum[symbol] = _.round(width, 2);
    sum += width;
    count++;
  });
  document.body.removeChild(span);
  symbolsEnum.avg = _.round(sum/count, 2);
  return symbolsEnum;
});

var initializeEtalon = _.memoize((container) => {
  container = container || document.body;
  var span = document.createElement('span');
  container.appendChild(span);
  span.innerHTML = 'A';
  var etalon = _.round(span.getBoundingClientRect().width, 2);
  container.removeChild(span);
  return etalon;
}, container => container && container.className);

var TOKEN = '...';

/*
 * options
 * - string {String} Строка для подрезки
 * - width {Number} Какая в итоге должна быть ширина
 * - Awidth {Number?} Ширина буквы А (если не передали, расчитывается body)
 * - container {DOMElement} для взятия пробы
 * - token {String} Разделитель
 */

const truncate = (options) => {
  var etalon = options.Awidth;
  if (!etalon) {
    etalon = initializeEtalon(options.container);
  }

  var token = options.token || TOKEN;

  var symbols = {};
  symbols = initializeSymbols(etalon);

  var tokenWidth = Array.prototype.reduce.call(token, (a, b) => {return a + symbols[b]}, 0);
  var widthBefore = options.width / 2;
  var widthAfter = options.width / 2 - tokenWidth;
  var phraseBefore = '';
  var phraseAfter = '';
  var currentSum = 0;
  var splittedString = options.string.split('');

  var result = splittedString.every(symbol => {
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
