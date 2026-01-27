import { Icon } from '@shared/ui/Icon';
import { useEffect, useState } from 'react';

// Scenarios: Center Blog Content -> Matched Ad Index
const SCENARIOS = [
  {
    blog: {
      title: 'React Hooks 마스터하기',
      tag: '프론트엔드',
      skeleton: ['w-3/4', 'w-full', 'w-2/3'],
    },
    matchIndex: 1, // Matches "Advanced ReactPatterns"
  },
  {
    blog: {
      title: '대규모 Node.js API 설계',
      tag: '백엔드',
      skeleton: ['w-2/3', 'w-full', 'w-3/4'],
    },
    matchIndex: 2, // Matches "NestJS Architecture"
  },
  {
    blog: {
      title: '실무자를 위한 K8s 가이드',
      tag: '인프라',
      skeleton: ['w-full', 'w-5/6', 'w-1/2'],
    },
    matchIndex: 0, // Matches "AWS & Docker"
  },
  {
    blog: {
      title: 'CS 전공 지식 요약',
      tag: 'CS',
      skeleton: ['w-3/4', 'w-full', 'w-1/2'],
    },
    matchIndex: 3, // Matches "CS"
  },
] as const;

export function HeroAlgorithmicMatch() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'analyzing' | 'matching'>('reading');

  const currentScenario = SCENARIOS[scenarioIndex];

  useEffect(() => {
    const runCycle = () => {
      // 0s: Start Reading (Show new blog)
      setPhase('reading');

      // 1.5s: Analyze (Pulse center)
      setTimeout(() => setPhase('analyzing'), 1500);

      // 3.0s: Match (Connect line)
      setTimeout(() => setPhase('matching'), 3000);

      // 5.0s: Next Scenario
      setTimeout(() => {
        setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
      }, 5000);
    };

    runCycle();
    const interval = setInterval(runCycle, 6000); // 1s buffer between cycles

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto mt-10 h-80 w-full max-w-4xl select-none sm:mt-12 sm:h-95">
      {/* Background Gradients */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

      {/* Center Node: Blog Post */}
      <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div
          className={`relative flex h-35 w-50 flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-xl transition-all duration-700 ${
            phase === 'reading' ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
        >
          {/* Fake Browser Header */}
          <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <div className="ml-2 h-2 w-20 rounded-full bg-gray-100" />
          </div>
          {/* Blog Content */}
          <div className="mt-3 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-900 font-bold text-[10px] leading-4 text-white">
              <span className="bg-gray-800 px-1">{currentScenario.blog.title}</span>
            </div>
            {currentScenario.blog.skeleton.map((width, i) => (
              <div key={i} className={`h-2 rounded bg-gray-100 ${width}`} />
            ))}
          </div>
          {/* Tag Pulse */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-500 ${
                phase === 'analyzing' || phase === 'matching'
                  ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500/20'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              #{currentScenario.blog.tag}
            </span>
          </div>
        </div>

      </div>

      {/* Ad Nodes (Satellites) - Fixed Categories */}
      {/* 0: Cloud/Infra (Top Left) */}
      <AdBannerNode
        position="left-[5%] top-[5%] sm:left-[10%] sm:top-[10%]"
        title="AWS & Docker 마스터"
        category="인프라 / 데브옵스"
        color="orange"
        isActive={phase === 'matching' && currentScenario.matchIndex === 0}
        icon={<Icon.Cloud className="h-5 w-5" />}
      />

      {/* 1: Frontend (Top Right) */}
      <AdBannerNode
        position="right-[5%] top-[5%] sm:right-[10%] sm:top-[10%]"
        title="실전 리액트 패턴 강의"
        category="프론트엔드"
        color="blue"
        isActive={phase === 'matching' && currentScenario.matchIndex === 1}
        icon={<Icon.Terminal className="h-5 w-5" />}
      />

      {/* 2: Backend (Bottom Left) */}
      <AdBannerNode
        position="left-[5%] bottom-[5%] sm:left-[10%] sm:bottom-[10%]"
        title="NestJS 아키텍처 특강"
        category="백엔드"
        color="red"
        isActive={phase === 'matching' && currentScenario.matchIndex === 2}
        icon={<Icon.Terminal className="h-5 w-5" />}
      />

      {/* 3: CS/Other (Bottom Right) */}
      <AdBannerNode
        position="right-[5%] bottom-[5%] sm:right-[10%] sm:bottom-[10%]"
        title="CS 면접 완전 정복"
        category="컴퓨터 사이언스"
        color="purple"
        isActive={phase === 'matching' && currentScenario.matchIndex === 3}
        icon={<Icon.Pen className="h-5 w-5" />}
      />

      {/* Connection Lines (SVG Overlay) */}
      {phase === 'matching' && (
        <svg className="absolute inset-0 pointer-events-none h-full w-full z-10">
          {/* Lines point to the 'Inner Corner' of each card roughly */}
          {currentScenario.matchIndex === 0 && ( // To Top Left Card (Bottom-Right corner)
            <line x1="50%" y1="50%" x2="32%" y2="32%" className="stroke-orange-400 stroke-3 animate-[dash_0.5s_linear]" strokeDasharray="10" />
          )}
          {currentScenario.matchIndex === 1 && ( // To Top Right Card (Bottom-Left corner)
            <line x1="50%" y1="50%" x2="68%" y2="32%" className="stroke-blue-400 stroke-3 animate-[dash_0.5s_linear]" strokeDasharray="10" />
          )}
          {currentScenario.matchIndex === 2 && ( // To Bottom Left Card (Top-Right corner)
            <line x1="50%" y1="50%" x2="32%" y2="68%" className="stroke-red-400 stroke-3 animate-[dash_0.5s_linear]" strokeDasharray="10" />
          )}
          {currentScenario.matchIndex === 3 && ( // To Bottom Right Card (Top-Left corner)
            <line x1="50%" y1="50%" x2="68%" y2="68%" className="stroke-purple-400 stroke-3 animate-[dash_0.5s_linear]" strokeDasharray="10" />
          )}
        </svg>
      )}
    </div>
  );
}

function AdBannerNode({
  position,
  title,
  category,
  color,
  isActive,
  icon,
}: {
  position: string;
  title: string;
  category: string;
  color: 'blue' | 'red' | 'orange' | 'purple';
  isActive: boolean;
  icon: React.ReactNode;
}) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-200 border-blue-200',
    red: 'bg-red-50 text-red-600 ring-red-200 border-red-200',
    orange: 'bg-orange-50 text-orange-600 ring-orange-200 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 ring-purple-200 border-purple-200',
  };

  const activeStyles = isActive
    ? `scale-110 ring-4 border-transparent shadow-lg ${colorStyles[color]}`
    : 'scale-100 border-gray-100 bg-white text-gray-500 opacity-60 grayscale';

  return (
    <div
      className={`absolute ${position} flex w-45 flex-col gap-2 rounded-xl border p-3 transition-all duration-500 ${activeStyles}`}
    >
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive ? 'bg-current/10' : 'bg-gray-100'}`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
          {category}
        </span>
      </div>
      <p className={`text-sm font-bold leading-tight ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
        {title}
      </p>
      {isActive && (
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-current/20">
          <div className="h-full w-full animate-[progress_2s_ease-out] bg-current" />
        </div>
      )}
    </div>
  );
}
