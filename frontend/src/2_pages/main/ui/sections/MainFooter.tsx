import { Icon } from '@shared/ui/Icon';
import { MAIN_FOOTER_LINK_GROUPS } from '../../model/content';

const CURRENT_YEAR = new Date().getFullYear();

export function MainFooter() {
  return (
    <footer id="blog" className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Icon.Logo className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-[-0.3px]">BoostAD</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            개발자 문서와 블로그에 자연스럽게 스며드는
            <br className="hidden sm:block" />
            프라이버시 친화 광고.
          </p>
        </div>

        {MAIN_FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-bold text-gray-900">{group.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-blue-600">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} BoostAD. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            Status: Operational
          </p>
        </div>
      </div>
    </footer>
  );
}
