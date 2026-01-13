import type { ReactNode } from 'react';
import Logo from '@shared/ui/Icon/icons/logo.svg?react';

export type ModalProps = {
  height?: string;
  children?: ReactNode;
  onClose?: () => void;
};

export function Modal(props: ModalProps) {
  const { height = 'h-auto', children, onClose } = props;
  return (
    <section
      className={`w-[600px] ${height} flex flex-col overflow-hidden rounded-[12px] border border-[#F0F1F4] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]`}
    >
      <header className="flex items-center justify-between gap-4 border-b border-[#F0F1F4] px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-blue-500" aria-hidden />
          <h2 className="text-lg font-semibold text-gray-900">BoostAD</h2>
        </div>
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
