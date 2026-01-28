import { Icon } from '@shared/ui/Icon';
import { SdkInstallStepCard } from './SdkInstallStepCard';
import type { SdkMode } from './SdkModeToggle';

interface SdkInstallGuideListProps {
  mode: SdkMode;
}

export function SdkInstallGuideList({ mode }: SdkInstallGuideListProps) {
  const autoSteps = [
    {
      icon: <Icon.Settings className="w-5 h-5 text-blue-500" />,
      stepNumber: 1,
      title: '티스토리 관리 > 꾸미기 > 스킨 편집 클릭',
      description: '관리자 페이지 왼쪽 메뉴바에서 꾸미기 항목을 찾으세요.',
      imageSrc: '/step1.png',
    },
    {
      icon: <Icon.Edit className="w-5 h-5 text-blue-500" />,
      stepNumber: 2,
      title: 'HTML 편집 클릭',
      description: '스킨 편집 화면 우측 상단의 HTML 편집 버튼을 누르세요.',
      imageSrc: '/step2.png',
    },
    {
      icon: <Icon.Terminal className="w-5 h-5 text-blue-500" />,
      stepNumber: 3,
      title: '<head> 태그 하단에 코드 붙여넣기',
      description:
        '복사한 코드를 <head>와 </head> 사이 제일 하단에 붙여넣으세요. 페이지 로딩을 방해하지 않고 광고가 안정적으로 삽입됩니다.',
      imageSrc: '/step3.png',
    },
  ];

  const manualSteps = [
    {
      icon: <Icon.Settings className="w-5 h-5 text-blue-500" />,
      stepNumber: 1,
      title: 'SDK 스크립트 복사',
      description: 'data-auto="false" 옵션이 반드시 포함되어야 합니다.',
      imageSrc: undefined,
    },
    {
      icon: <Icon.Terminal className="w-5 h-5 text-blue-500" />,
      stepNumber: 2,
      title: '코드 삽입',
      description:
        '복사한 코드를 index.html의 <head> 태그 하단에 붙여넣으세요. 페이지 로딩에 영향을 주지 않으면서 광고가 안정적으로 동작합니다.',
      imageSrc: undefined,
    },
    {
      icon: <Icon.Edit className="w-5 h-5 text-blue-500" />,
      stepNumber: 3,
      title: '광고 영역 정의',
      description:
        '광고가 노출되기를 원하는 위치에 data-boostad-zone 속성을 가진 div 요소를 생성합니다. data-context 속성에 페이지의 문맥을 명시하면 해당 문맥에 맞는 광고가 매칭됩니다.',
      imageSrc: undefined,
    },
    {
      icon: <Icon.LineLeft className="w-3 h-3 text-blue-500" />,
      stepNumber: 4,
      title: '광고 레이아웃 확인',
      description:
        '설정된 영역의 너비와 높이에 맞춰 광고가 동적으로 생성됩니다. CSS를 통해 해당 div의 크기를 미리 지정하는 것을 권장합니다.',
      imageSrc: undefined,
    },
    {
      icon: <Icon.Edit className="w-5 h-5 text-blue-500" />,
      stepNumber: 5,
      title: '배포 및 검증',
      description:
        '코드를 배포한 후 실제 서비스에서 광고가 정상적으로 출력되는지 확인하세요. 대시보드에서 노출 통계를 실시간으로 확인할 수 있습니다.',
      imageSrc: undefined,
    },
  ];

  const steps = mode === 'auto' ? autoSteps : manualSteps;

  return (
    <div className="flex flex-col w-150 gap-4">
      <h2 className="font-bold text-xl text-gray-900">설치 가이드</h2>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <SdkInstallStepCard
            key={step.stepNumber}
            icon={step.icon}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            imageSrc={step.imageSrc}
          />
        ))}
      </div>
    </div>
  );
}
