import { Icon } from '@shared/ui/Icon';
import { SdkInstallStepCard } from './SdkInstallStepCard';

export function SdkInstallGuideList() {
  const steps = [
    {
      icon: <Icon.Settings className="w-5 h-5 text-blue-500" />,
      stepNumber: 1,
      title: '티스토리 관리 > 꾸미기 클릭',
      description: '관리자 페이지 왼쪽 메뉴바에서 꾸미기 항목을 찾으세요.',
    },
    {
      icon: <Icon.Edit className="w-5 h-5 text-blue-500" />,
      stepNumber: 2,
      title: 'HTML 편집 클릭',
      description: '스킨 편집 화면 우측 상단의 HTML 편집 버튼을 누르세요.',
    },
    {
      icon: <Icon.Terminal className="w-5 h-5 text-blue-500" />,
      stepNumber: 3,
      title: '<head> 태그 안에 코드 붙여넣기',
      description:
        '복사한 코드를 <head>와 </head> 사이 적절한 곳에 붙여넣으세요.',
    },
  ];

  return (
    <div className="flex flex-col min-w-150 gap-4">
      <h2 className="font-bold text-xl text-gray-900">설치 가이드</h2>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <SdkInstallStepCard
            key={step.stepNumber}
            icon={step.icon}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </div>
  );
}
