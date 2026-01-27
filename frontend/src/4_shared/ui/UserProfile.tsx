import { useCurrentUser } from '@shared/lib/hooks/useCurrentUser';

export function UserProfile() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return null;
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADVERTISER':
        return '광고주';
      case 'PUBLISHER':
        return '퍼블리셔';
      default:
        return role;
    }
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-3 bg-white border-t border-gray-200">
      <div className="w-6 h-6 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-xs font-semibold text-blue-600">
          {user.email[0].toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <span className="text-sm font-medium text-gray-900 truncate">
          {user.email}
        </span>
        <span className="text-xs text-gray-500">{getRoleLabel(user.role)}</span>
      </div>
    </div>
  );
}
