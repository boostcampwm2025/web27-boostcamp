import { Icon } from '@shared/ui/Icon';
import { useNavigate } from 'react-router-dom';

export function OnboardingHeader() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center w-full h-16 bg-white border-b border-gray-200 px-6 text-2xl font-bold text-gray-900 whitespace-nowrap">
      <div
        onClick={()=>{navigate('/')}}
        className="flex flex-row h-16 items-center gap-3 border-b border-gray-200 text-gray-900 text-lg font-bold cursor-pointer"
      >
        <Icon.Logo className="w-8 h-8 text-blue-500" />
        BoostAD
      </div>
    </header>
  );
}
