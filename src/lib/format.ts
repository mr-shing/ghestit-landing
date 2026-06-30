// Persian-locale formatting helpers shared by the ported app pages.

const faNum = new Intl.NumberFormat('fa-IR');

/** Group-format a Toman/Rial amount with Persian digits. */
export function money(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return faNum.format(n);
}

/** Convert ASCII digits in an already-localized/Jalali date string to Persian. */
export function toFaDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '—';
  return String(input).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}
