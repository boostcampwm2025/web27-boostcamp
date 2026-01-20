import { Icon } from '@shared/ui/Icon';

interface SdkInstallStepCardProps {
  icon?: React.ReactNode;
  stepNumber: number;
  title: string;
  description: string;
  imageSrc?: string;
}

export function SdkInstallStepCard({
  icon,
  stepNumber,
  title,
  description,
  imageSrc,
}: SdkInstallStepCardProps) {
  return (
    <div className="flex flex-row bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <div className="flex flex-row items-center gap-2">
          {icon && <span className="">{icon}</span>}
          <span className="font-medium text-sm text-blue-500">
            STEP {stepNumber}
          </span>
        </div>
        <h4 className="font-bold text-medium text-gray-900">{title}</h4>
        <p className="text-xs font-normal text-gray-500">{description}</p>
      </div>
      <div className="flex items-center ml-5 shrink-0 w-26 h-20">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`Step ${stepNumber}`}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
          />
        ) : (
          <Icon.ImageArea className="w-full h-full text-gray-300" />
        )}
      </div>
    </div>
  );
}
