import { useNavigate } from 'react-router-dom';

export function OnboardingHeader() {
  const navigate = useNavigate();
  return (
    <header className="flex h-16 w-full items-center border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-6">
        <button
          type="button"
          onClick={() => {
            navigate('/');
          }}
          className="flex items-center gap-3 text-lg font-bold text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center">
            <img
              src="/favicon/favicon-96x96.png"
              alt="BoostAD Logo"
              className="h-8 w-8"
            />
          </span>
          BoostAD
        </button>
      </div>
    </header>
  );
}
