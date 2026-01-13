import { useContext } from 'react';
import { ToastContext } from './toastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('ToastProvider를 찾을 수 없습니다');
  }
  return context;
}
