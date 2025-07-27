type DateTypeStyle = 'full' | 'long' | 'medium' | 'short';
const currentYear = new Date().getFullYear();

export function dateFormatter(d: Date | null, style: DateTypeStyle | any = 'medium') {
  if (!d) {
    return '';
  }
  if (typeof style !== 'string') {
    style = 'medium';
  }
  if (d.toDateString() === new Date().toDateString()) {
    return 'Сегодня';
  } else if (d.toDateString() === new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toDateString()) {
    return 'Вчера';
  } else if (d.toDateString() === new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toDateString()) {
    return 'Завтра';
  }
  return d.toLocaleDateString('ru-RU', { dateStyle: style }).replace(' г.', '').replace(String(currentYear), '');
}

export function timeFormatter(d: Date | null, style: DateTypeStyle | any = 'short') {
  if (!d) {
    return '';
  }
  if (typeof style !== 'string') {
    style = 'short';
  }
  return d.toLocaleTimeString('ru-RU', { timeStyle: style });
}

export function dateTimeFormatter(
  d: Date | null,
  dateStyle: DateTypeStyle | any = 'medium',
  timeStyle: DateTypeStyle | any = 'short',
) {
  if (!d) {
    return '';
  }
  if (typeof dateStyle !== 'string') {
    dateStyle = 'medium';
  }
  if (typeof timeStyle !== 'string') {
    timeStyle = 'short';
  }
  return dateFormatter(d, dateStyle) + ' ' + timeFormatter(d, timeStyle);
}

export function moneyFormatter(val: number): string {
  let postfix = '';
  if (val >= 1_000_000_000) {
    val /= 1_000_000_000;
    postfix = 'млрд.';
  } else if (val >= 1_000_000) {
    val /= 1_000_000;
    postfix = 'млн.';
  } else if (val >= 1_000) {
    val /= 1_000;
    postfix = 'тыс.';
  }
  return `${Math.floor(val * 10) / 10} ${postfix} ₽`;
}
