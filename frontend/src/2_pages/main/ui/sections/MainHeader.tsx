import { Link } from 'react-router-dom';
import { Icon } from '@shared/ui/Icon';
import { MAIN_NAV_ITEMS } from '../../model/content';

export function MainHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center">
            <Icon.Logo className="h-8 w-8 text-blue-500" />
          </span>
          <span className="text-lg font-bold">BoostAD</span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-gray-900 md:flex"
          aria-label="메인 내비게이션"
        >
          {MAIN_NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="hidden text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 sm:inline-flex"
          >
            로그인
          </Link>
          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center rounded-[10px] bg-blue-500 px-4 py-2 text-sm font-bold text-white shadow-[0px_10px_15px_rgba(37,99,235,0.16),0px_4px_6px_rgba(37,99,235,0.16)] transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
