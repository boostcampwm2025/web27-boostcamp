import { Icon } from '@shared/ui/Icon';
import { NavLink, useLocation } from 'react-router-dom';
import { UserProfile } from '@shared/ui/UserProfile';

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
      to: '/advertiser/dashboard/main',
      icon: 'Dashboard',
      label: '대시보드',
    },
    {
      id: '2',
      to: '/advertiser/dashboard/campaigns',
      icon: 'LoudSpeaker',
      label: '캠페인 관리',
    },
    {
      id: '3',
      to: '/advertiser/dashboard/history',
      icon: 'Clock',
      label: '입찰 히스토리',
    },
    {
      id: '4',
      to: '/advertiser/dashboard/budget',
      icon: 'Wallet',
      label: '예산 관리',
    },
  ];

  const publisherMenuItems: MenuItem[] = [
    {
      id: '1',
      to: '/publisher/dashboard/main',
      icon: 'Dashboard',
      label: '대시보드',
    },
    {
      id: '2',
      to: '/publisher/dashboard/sdk-guide',
      icon: 'Ad',
      label: 'SDK 가이드',
    },
  ];

  const menuItems = isAdvertiser ? advertiserMenuItems : publisherMenuItems;

  return (
    <aside
      className="flex flex-col w-52 shrink-0 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <header className="flex flex-row h-16 items-center gap-3 py-4 px-6 border-b border-gray-200 text-gray-900 text-lg font-bold">
        <img src="/favicon/favicon-96x96.png" alt="BoostAD Logo" className="w-8 h-8" />
        BoostAD
      </header>

      <nav className="p-4 flex-1">
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

      <UserProfile />
    </aside>
  );
}
