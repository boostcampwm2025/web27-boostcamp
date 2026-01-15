export function formatWithComma(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('ko-KR');
}

export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
