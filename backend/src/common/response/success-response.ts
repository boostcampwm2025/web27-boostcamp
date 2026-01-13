export type SuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T;
  timestamp: string;
};

export const successResponse = <T>(
  data: T,
  message = 'OK'
): SuccessResponse<T> => {
  return {
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
