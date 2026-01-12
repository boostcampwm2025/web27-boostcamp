import { Icon } from '@shared/ui/Icon';
import { NavLink, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  to: string;
  icon: keyof typeof Icon;
  label: string;
}

export function Sidebar() {
  const location = useLocation();
  const isAdvertiser = location.pathname.startsWith('/advertiser');

  const advertiserMenuItems: MenuItem[] = [
    {
      id: '1',
      to: '/advertiser/dashboard',
      icon: 'Dashboard',
      label: '대시보드',
    },
    {
      id: '2',
      to: '/advertiser/campaigns',
      icon: 'LoudSpeaker',
      label: '캠페인 관리',
    },
    {
      id: '3',
      to: '/advertiser/budget',
      icon: 'Wallet',
      label: '예산 관리',
    },
  ];

  const publisherMenuItems: MenuItem[] = [
    {
      id: '1',
      to: '/publisher/dashboard',
      icon: 'Dashboard',
      label: '대시보드',
    },
    {
      id: '2',
      to: '/publisher/earnings',
      icon: 'Wallet',
      label: '수익 관리',
    },
    {
      id: '3',
      to: '/publisher/settings',
      icon: 'Dashboard',
      label: '광고 설정',
    },
  ];

  const menuItems = isAdvertiser ? advertiserMenuItems : publisherMenuItems;

  return (
    <aside
      className="flex flex-col w-64 bg-white border-r border-gray-200"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* 로고 영역 */}
      <header className="flex flex-row h-16 items-center gap-3 py-4 px-6 border-b border-gray-200 text-gray-900 text-lg font-bold">
        <Icon.Logo className="w-8 h-8 text-blue-500" />
        BoostAD
      </header>

      {/* 네비게이션 메뉴 */}
      <nav className="p-4">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const IconComponent = Icon[item.icon];
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex flex-row items-center gap-3 p-2 rounded-lg ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-blue-100'
                    }`
                  }
                >
                  <IconComponent className="w-7 h-7" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
