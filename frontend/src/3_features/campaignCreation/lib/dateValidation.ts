const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function isValidDateFormat(date: string) {
  return date ? DATE_REGEX.test(date) : false;
}

export function isDateInPast(date: string) {
  if (!isValidDateFormat(date)) {
    return false;
  }
  return date < getToday();
}

export function isEndDateBeforeStartDate(startDate: string, endDate: string) {
  if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
    return false;
  }
  return endDate < startDate;
}

export function validateStartDate(startDate: string) {
  if (!startDate) {
    return null;
  }
  if (!isValidDateFormat(startDate)) {
    return '올바른 날짜 형식이 아닙니다';
  }
  if (isDateInPast(startDate)) {
    return '시작일은 오늘 이후여야 합니다';
  }
  return null;
}

export function validateEndDate(startDate: string, endDate: string) {
  if (!endDate) {
    return null;
  }
  if (!isValidDateFormat(endDate)) {
    return '올바른 날짜 형식이 아닙니다';
  }
  if (startDate && isEndDateBeforeStartDate(startDate, endDate)) {
    return '종료일은 시작일 이후여야 합니다';
  }
  return null;
}

export function formatDateForDisplay(date: string) {
  if (!date || !isValidDateFormat(date)) {
    return '-';
  }
  const [year, month, day] = date.split('-');
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}
