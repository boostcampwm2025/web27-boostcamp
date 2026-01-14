import { Icon } from '@shared/ui/Icon';

interface SdkInstallStepCardProps {
  icon?: React.ReactNode;
  stepNumber: number;
  title: string;
  description: string;
}

export function SdkInstallStepCard({
  icon,
  stepNumber,
  title,
  description,
}: SdkInstallStepCardProps) {
  return (
    <div className="flex flex-row justify-between bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          {icon && <span className="">{icon}</span>}
          <span className="font-medium text-sm text-blue-500">
            STEP {stepNumber}
          </span>
        </div>
        <h4 className="font-bold text-medium text-gray-900">{title}</h4>
        <p className="text-xs font-normal whitespace-nowrap text-gray-500">
          {description}
        </p>
      </div>
      <Icon.ImageArea className="w-26 text-gray-300" />
    </div>
  );
}
