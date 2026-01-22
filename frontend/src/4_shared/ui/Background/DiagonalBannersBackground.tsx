import { useMemo } from 'react';

type BannerSize = {
  width: number;
  height: number;
};

type BannerTone = 'blue' | 'purple' | 'emerald';

type BannerItem = {
  id: string;
  size: BannerSize;
  x: number; // px (tile space)
  y: number; // px (tile space)
  opacity: number;
  tone: BannerTone;
};

type Box = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

// 카드(배너) 크기는 다양하게, 각도는 "전부 동일"하게 흘러가도록 구성
const BANNER_SIZES: BannerSize[] = [
  { width: 180, height: 56 }, // thin
  { width: 220, height: 64 },
  { width: 240, height: 72 },
  { width: 260, height: 84 },
  { width: 280, height: 96 },
  { width: 300, height: 72 }, // wide + thin
  { width: 320, height: 110 },
  { width: 340, height: 88 },
  { width: 360, height: 140 }, // taller
  { width: 380, height: 96 },
  { width: 400, height: 128 },
  { width: 420, height: 104 },
  { width: 440, height: 156 }, // tall
  { width: 480, height: 120 },
  { width: 520, height: 92 }, // very wide + thin
  { width: 560, height: 140 }, // very wide
  { width: 260, height: 160 }, // narrow + tall
  { width: 300, height: 120 },
];

const TONES: BannerTone[] = ['blue', 'purple', 'emerald'];

// 회전된 플레인 안에서 "가로" 이동 → 화면에서는 사선(좌하단 → 우상단)으로 보이게 됨
const FLOW_ANGLE_DEG = -28;
const PLANE_SCALE = 2.4; // 240vw / 240vh

// 지금은 너무 느리다는 피드백 반영: px/sec 기준으로 속도 설정 (뷰포트 크기와 무관하게 체감 일정)
const SPEED_PX_PER_SEC = 52;

// 겹침 방지용 최소 간격(패딩)
const COLLISION_PADDING_PX = 18;
const MAX_PLACE_ATTEMPTS = 220;

const makeRng = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const pick = <T,>(arr: T[], rand: () => number) =>
  arr[Math.floor(rand() * arr.length)];

const toBox = (
  x: number,
  y: number,
  size: BannerSize,
  padding: number
): Box => ({
  left: x - size.width / 2 - padding,
  right: x + size.width / 2 + padding,
  top: y - size.height / 2 - padding,
  bottom: y + size.height / 2 + padding,
});

const intersects = (a: Box, b: Box) =>
  !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

const getItemCount = (planeWidthPx: number) => {
  if (planeWidthPx < 1100) return 14;
  if (planeWidthPx < 1600) return 18;
  if (planeWidthPx < 2400) return 24;
  if (planeWidthPx < 3200) return 30;
  return 36;
};

const buildNonOverlappingItems = (
  seed: number,
  planeWidthPx: number,
  planeHeightPx: number
): BannerItem[] => {
  const rand = makeRng(seed);
  const targetCount = getItemCount(planeWidthPx);

  const items: BannerItem[] = [];
  const boxes: Box[] = [];

  const canPlace = (box: Box) => boxes.every((b) => !intersects(box, b));

  const placeAt = (x: number, y: number, size: BannerSize) => {
    const safeX = clamp(
      x,
      COLLISION_PADDING_PX + size.width / 2,
      planeWidthPx - COLLISION_PADDING_PX - size.width / 2
    );
    const safeY = clamp(
      y,
      COLLISION_PADDING_PX + size.height / 2,
      planeHeightPx - COLLISION_PADDING_PX - size.height / 2
    );
    const box = toBox(safeX, safeY, size, COLLISION_PADDING_PX);

    if (!canPlace(box)) return false;

    const tone = pick(TONES, rand);
    const opacity = 0.85 + rand() * 0.15; // 0.85~1.0 (너무 흐리지 않게)

    items.push({
      id: `b-${seed}-${items.length}`,
      size,
      x: safeX,
      y: safeY,
      opacity,
      tone,
    });
    boxes.push(box);
    return true;
  };

  const tryPlaceNear = (
    cx: number,
    cy: number,
    radius: number,
    size: BannerSize
  ) => {
    for (let attempt = 0; attempt < MAX_PLACE_ATTEMPTS; attempt += 1) {
      const angle = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * radius;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (placeAt(x, y, size)) return true;
    }
    return false;
  };

  const tryPlaceAnywhere = (size: BannerSize) => {
    for (let attempt = 0; attempt < MAX_PLACE_ATTEMPTS; attempt += 1) {
      const x = rand() * planeWidthPx;
      const y = rand() * planeHeightPx;
      if (placeAt(x, y, size)) return true;
    }
    return false;
  };

  // 클러스터 중심 몇 개를 만들고, 주변에 배너를 배치 (하지만 겹치면 재시도)
  const clusterCount = Math.max(4, Math.floor(targetCount / 4)); // 4~9 정도
  for (let c = 0; c < clusterCount && items.length < targetCount; c += 1) {
    const cx = rand() * planeWidthPx;
    const cy = rand() * planeHeightPx;
    const radius = 180 + rand() * 280; // 180~460px
    const count = 2 + Math.floor(rand() * 4); // 2~5

    for (let i = 0; i < count && items.length < targetCount; i += 1) {
      const size = pick(BANNER_SIZES, rand);
      if (!tryPlaceNear(cx, cy, radius, size)) {
        tryPlaceAnywhere(size);
      }
    }
  }

  // 나머지는 전체 영역에 솔로로 배치
  let guard = 0;
  while (items.length < targetCount && guard < targetCount * 12) {
    guard += 1;
    const size = pick(BANNER_SIZES, rand);
    tryPlaceAnywhere(size);
  }

  return items;
};

const getIconToneClass = (tone: BannerTone) => {
  if (tone === 'purple') return 'bg-purple-500/25 ring-purple-500/25';
  if (tone === 'emerald') return 'bg-emerald-500/25 ring-emerald-500/25';
  return 'bg-blue-500/25 ring-blue-500/25';
};

const getPillToneClass = (tone: BannerTone) => {
  if (tone === 'purple') return 'bg-purple-500/25 ring-purple-500/25';
  if (tone === 'emerald') return 'bg-emerald-500/25 ring-emerald-500/25';
  return 'bg-blue-500/25 ring-blue-500/25';
};

export function DiagonalBannersBackground() {
  const viewportWidth = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const viewportHeight =
    typeof window === 'undefined' ? 800 : window.innerHeight;

  const planeWidthPx = viewportWidth * PLANE_SCALE;
  const planeHeightPx = viewportHeight * PLANE_SCALE;

  const items = useMemo(
    () => buildNonOverlappingItems(777, planeWidthPx, planeHeightPx),
    [planeWidthPx, planeHeightPx]
  );

  const durationSeconds = clamp(planeWidthPx / SPEED_PX_PER_SEC, 18, 160);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[#F6F6F8]" />

      <div
        className="absolute left-1/2 top-1/2 h-[240vh] w-[240vw]"
        style={{
          transform: `translate(-50%, -50%) rotate(${FLOW_ANGLE_DEG}deg)`,
        }}
      >
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: 0.75 }}>
          <div
            className="banner-track flex h-full w-[200%] will-change-transform"
            style={{
              animationDuration: `${durationSeconds.toFixed(0)}s`,
              animationDelay: `${-(durationSeconds * 0.6).toFixed(0)}s`,
            }}
          >
            {/* tile A */}
            <div className="relative h-full w-1/2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="banner-card absolute rounded-2xl border border-white/80 bg-white/85 shadow-md"
                  style={{
                    left: `${(item.x / planeWidthPx) * 100}%`,
                    top: `${(item.y / planeHeightPx) * 100}%`,
                    width: `${item.size.width}px`,
                    height: `${item.size.height}px`,
                    opacity: item.opacity,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="flex h-full w-full items-center gap-3 px-4">
                    <div
                      className={`h-10 w-10 rounded-xl ring-1 ${getIconToneClass(
                        item.tone
                      )}`}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="h-3 w-3/4 rounded bg-gray-900/15" />
                      <div className="h-2 w-full rounded bg-gray-900/15" />
                      <div className="h-2 w-5/6 rounded bg-gray-900/15" />
                    </div>
                    <div
                      className={`h-8 w-20 rounded-full ring-1 ${getPillToneClass(
                        item.tone
                      )}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* tile B (seamless loop) */}
            <div className="relative h-full w-1/2" aria-hidden="true">
              {items.map((item) => (
                <div
                  key={`dup-${item.id}`}
                  className="banner-card absolute rounded-2xl border border-white/80 bg-white/85 shadow-md"
                  style={{
                    left: `${(item.x / planeWidthPx) * 100}%`,
                    top: `${(item.y / planeHeightPx) * 100}%`,
                    width: `${item.size.width}px`,
                    height: `${item.size.height}px`,
                    opacity: item.opacity,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="flex h-full w-full items-center gap-3 px-4">
                    <div
                      className={`h-10 w-10 rounded-xl ring-1 ${getIconToneClass(
                        item.tone
                      )}`}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="h-3 w-3/4 rounded bg-gray-900/15" />
                      <div className="h-2 w-full rounded bg-gray-900/15" />
                      <div className="h-2 w-5/6 rounded bg-gray-900/15" />
                    </div>
                    <div
                      className={`h-8 w-20 rounded-full ring-1 ${getPillToneClass(
                        item.tone
                      )}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 폼 가독성 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/0" />

      <style>
        {`
          @keyframes banner-marquee {
            0% {
              transform: translate3d(-50%, 0, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }

          .banner-track {
            animation-name: banner-marquee;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .banner-track {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
