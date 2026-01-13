import type { ReactNode } from 'react';
import { ModalHeader } from './ModalHeader';

export type ModalProps = {
  height?: string;
  children?: ReactNode;
};

export function Modal(props: ModalProps) {
  const { height = 'h-auto', children } = props;
  return (
    <section
      className={`w-[600px] ${height} flex flex-col overflow-hidden rounded-[12px] border border-[#F0F1F4] bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]`}
    >
      <ModalHeader />
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}
