export function DataFlowLinesBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.0" />
            <stop offset="30%" stopColor="#2563EB" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#7C3AED" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
          </linearGradient>

          <radialGradient id="dotGradient">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g fill="none" stroke="url(#flowGradient)" strokeLinecap="round">
          <path
            className="flow-line flow-line--a"
            d="M-80,120 C140,40 320,220 520,120 C700,30 860,60 1100,140"
            strokeWidth="2"
            strokeDasharray="10 22"
          />
          <path
            className="flow-line flow-line--b"
            d="M-100,320 C180,260 260,420 520,350 C760,280 820,420 1100,340"
            strokeWidth="2"
            strokeDasharray="6 18"
          />
          <path
            className="flow-line flow-line--c"
            d="M-60,520 C120,420 360,560 560,520 C760,480 840,520 1100,460"
            strokeWidth="2"
            strokeDasharray="14 30"
          />
        </g>

        <g opacity="0.9">
          <circle r="6" fill="url(#dotGradient)">
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              path="M-80,120 C140,40 320,220 520,120 C700,30 860,60 1100,140"
            />
          </circle>
          <circle r="5" fill="url(#dotGradient)">
            <animateMotion
              dur="18s"
              repeatCount="indefinite"
              path="M-100,320 C180,260 260,420 520,350 C760,280 820,420 1100,340"
            />
          </circle>
          <circle r="5" fill="url(#dotGradient)">
            <animateMotion
              dur="16s"
              repeatCount="indefinite"
              path="M-60,520 C120,420 360,560 560,520 C760,480 840,520 1100,460"
            />
          </circle>
        </g>
      </svg>

      {/* 폼 가독성을 위한 미세 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />

      <style>
        {`
          .flow-line {
            animation: flow-dash 18s linear infinite;
          }
          .flow-line--b {
            animation-duration: 22s;
            animation-direction: reverse;
          }
          .flow-line--c {
            animation-duration: 26s;
          }

          @keyframes flow-dash {
            to {
              stroke-dashoffset: -1000;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .flow-line {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

