import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function formatToINR(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return '00.00';

  const DefaultCurrency = localStorage.getItem('DefaultCurrency') || 'INR';
  const AmountHide = localStorage.getItem('AmountHide');

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: DefaultCurrency,
    minimumFractionDigits: 0,
  });

  if (AmountHide && Number(AmountHide) === 1) {
    const lastTwoDigits = Math.floor(number % 100);
    return `***${lastTwoDigits.toString().padStart(2, '0')}`;
  }
  return formatter.format(number).replace('₹', '₹ ');
}
