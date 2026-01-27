// 날짜 유효성 검사
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
    return '시작일을 입력해주세요.';
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
    return '종료일을 입력해주세요.';
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

// 예산 유효성 검사
export const MIN_DAILY_BUDGET = 3000;

export function validateMaxCpc(maxCpc: number, dailyBudget: number) {
  if (maxCpc <= 0) {
    return 'CPC를 입력해주세요.';
  }
  if (dailyBudget > 0 && maxCpc > dailyBudget) {
    return 'CPC 값은 하루 예산을 초과할 수 없습니다.';
  }
  return null;
}

export function validateDailyBudget(
  dailyBudget: number,
  totalBudget: number,
  maxCpc: number
) {
  if (dailyBudget <= 0) {
    return '하루 예산을 입력해주세요.';
  }
  if (dailyBudget < MIN_DAILY_BUDGET) {
    return `최소 ${MIN_DAILY_BUDGET.toLocaleString()}원 이상 입력해주세요`;
  }
  if (maxCpc > 0 && dailyBudget < maxCpc) {
    return '하루 예산은 CPC 이상이어야 합니다.';
  }
  if (totalBudget > 0 && dailyBudget > totalBudget) {
    return '하루 예산은 총 예산을 초과할 수 없습니다.';
  }
  return null;
}

export function validateTotalBudget(
  totalBudget: number,
  dailyBudget: number,
  balance: number | null
) {
  if (totalBudget <= 0) {
    return '총 예산을 입력해주세요.';
  }
  if (dailyBudget > 0 && totalBudget < dailyBudget) {
    return '총 예산은 하루 예산 이상이어야 합니다.';
  }
  if (balance !== null && totalBudget > balance) {
    return '총 예산은 보유 잔액을 초과할 수 없습니다.';
  }
  return null;
}

interface Step2ValidationParams {
  dailyBudget: number;
  totalBudget: number;
  balance: number | null;
  maxCpc: number;
  startDate: string;
  endDate: string;
}

export function isStep2Valid(params: Step2ValidationParams) {
  const { maxCpc, dailyBudget, totalBudget, startDate, endDate, balance } =
    params;

  return (
    validateMaxCpc(maxCpc, dailyBudget) === null &&
    validateDailyBudget(dailyBudget, totalBudget, maxCpc) === null &&
    validateTotalBudget(totalBudget, dailyBudget, balance) === null &&
    validateStartDate(startDate) === null &&
    validateEndDate(startDate, endDate) === null
  );
}
