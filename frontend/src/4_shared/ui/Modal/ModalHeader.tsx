import Logo from '@shared/ui/Icon/icons/logo.svg?react';

export function ModalHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[#F0F1F4] px-6 py-4">
      <div className="flex items-center gap-3">
        <Logo className="h-8 w-8 text-blue-500" aria-hidden />
        <h2 className="text-lg font-semibold text-gray-900">BoostAD</h2>
      </div>
    </header>
  );
}
