import type { SVGProps, ReactNode } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export type IconName =
  | 'arrowRight'
  | 'bug'
  | 'click'
  | 'clock'
  | 'filter'
  | 'sparkles'
  | 'tag'
  | 'tags'
  | 'trendUp'
  | 'trophy';

const icons: Record<IconName, ReactNode> = {
  arrowRight: (
    <>
      <path
        d="M3.33333 8H12.6667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.33333L12.6667 8L8 12.6667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  bug: (
    <>
      <path
        d="M5.33333 1.33333L6.58667 2.58667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.41333 2.58667L10.6667 1.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4.75333V4.08667C5.98792 3.8165 6.03069 3.54668 6.12575 3.2935C6.22081 3.04032 6.36618 2.80902 6.55309 2.61357C6.74 2.41811 6.96457 2.26255 7.21325 2.15627C7.46193 2.04999 7.72956 1.9952 8 1.9952C8.27044 1.9952 8.53808 2.04999 8.78676 2.15627C9.03544 2.26255 9.26001 2.41811 9.44691 2.61357C9.63382 2.80902 9.77919 3.04032 9.87425 3.2935C9.96931 3.54668 10.0121 3.8165 10 4.08667V4.75333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13.3333C5.8 13.3333 4 11.5333 4 9.33333V7.33333C4 6.62609 4.28095 5.94781 4.78105 5.44771C5.28115 4.94762 5.95942 4.66667 6.66667 4.66667H9.33333C10.0406 4.66667 10.7189 4.94762 11.219 5.44771C11.719 5.94781 12 6.62609 12 7.33333V9.33333C12 11.5333 10.2 13.3333 8 13.3333Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 13.3333V7.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.35333 6C3.06667 5.86667 2 4.73333 2 3.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8.66667H1.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14C2 12.6 3.13333 11.4 4.53333 11.3333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.98 3.33333C13.98 4.73333 12.9133 5.86667 11.6467 6"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6667 8.66667H12"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4667 11.3333C12.8667 11.4 14 12.6 14 14"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  click: (
    <>
      <path
        d="M9.33333 2.73333L8 4"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.39999 5.33333L1.46666 4.8"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 8L2.73334 9.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.8 1.46667L5.33334 3.4"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.02467 6.46C5.99882 6.3991 5.99175 6.33187 6.00438 6.26693C6.017 6.20198 6.04874 6.14229 6.09552 6.09551C6.1423 6.04873 6.20199 6.01699 6.26693 6.00437C6.33187 5.99175 6.39911 5.99882 6.46 6.02467L13.7933 9.02467C13.8586 9.05144 13.9137 9.09823 13.9507 9.15831C13.9877 9.21838 14.0046 9.28864 13.9991 9.35897C13.9937 9.4293 13.966 9.49608 13.9202 9.5497C13.8743 9.60331 13.8126 9.641 13.744 9.65733L10.8447 10.3513C10.725 10.3799 10.6155 10.4411 10.5285 10.528C10.4414 10.615 10.3801 10.7244 10.3513 10.844L9.658 13.744C9.64185 13.8129 9.6042 13.8748 9.55052 13.9209C9.49683 13.9669 9.42989 13.9947 9.35937 14.0002C9.28885 14.0057 9.21842 13.9886 9.15825 13.9514C9.09808 13.9142 9.0513 13.8589 9.02467 13.7933L6.02467 6.46Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  clock: (
    <>
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 3V6L8 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  filter: (
    <>
      <path
        d="M13.3333 4.66667H7.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33333 11.3333H3.33333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3333 13.3333C12.4379 13.3333 13.3333 12.4379 13.3333 11.3333C13.3333 10.2288 12.4379 9.33333 11.3333 9.33333C10.2288 9.33333 9.33333 10.2288 9.33333 11.3333C9.33333 12.4379 10.2288 13.3333 11.3333 13.3333Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66667 6.66667C5.77124 6.66667 6.66667 5.77124 6.66667 4.66667C6.66667 3.5621 5.77124 2.66667 4.66667 2.66667C3.5621 2.66667 2.66667 3.5621 2.66667 4.66667C2.66667 5.77124 3.5621 6.66667 4.66667 6.66667Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  sparkles: (
    <>
      <path
        d="M4.9685 7.75C4.92386 7.57696 4.83367 7.41905 4.70731 7.29269C4.58095 7.16633 4.42304 7.07614 4.25 7.0315L1.1825 6.2405C1.13017 6.22564 1.08411 6.19412 1.05131 6.15072C1.01851 6.10732 1.00076 6.0544 1.00076 6C1.00076 5.9456 1.01851 5.89268 1.05131 5.84928C1.08411 5.80587 1.13017 5.77435 1.1825 5.7595L4.25 4.968C4.42298 4.9234 4.58085 4.83329 4.7072 4.70702C4.83356 4.58075 4.92378 4.42294 4.9685 4.25L5.7595 1.1825C5.7742 1.12996 5.80569 1.08367 5.84916 1.0507C5.89263 1.01772 5.94569 0.999874 6.00025 0.999874C6.05481 0.999874 6.10787 1.01772 6.15134 1.0507C6.19481 1.08367 6.2263 1.12996 6.241 1.1825L7.0315 4.25C7.07614 4.42303 7.16633 4.58095 7.29269 4.70731C7.41905 4.83367 7.57696 4.92386 7.75 4.9685L10.8175 5.759C10.8703 5.77355 10.9168 5.805 10.9499 5.84854C10.9831 5.89207 11.001 5.94528 11.001 6C11.001 6.05472 10.9831 6.10793 10.9499 6.15146C10.9168 6.19499 10.8703 6.22645 10.8175 6.241L7.75 7.0315C7.57696 7.07614 7.41905 7.16633 7.29269 7.29269C7.16633 7.41905 7.07614 7.57696 7.0315 7.75L6.2405 10.8175C6.2258 10.87 6.19431 10.9163 6.15084 10.9493C6.10737 10.9823 6.05431 11.0001 5.99975 11.0001C5.94519 11.0001 5.89213 10.9823 5.84866 10.9493C5.80519 10.9163 5.7737 10.87 5.759 10.8175L4.9685 7.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 1.5V3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 2.5H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.5V9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 9H1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  tag: (
    <>
      <path
        d="M6.293 1.293C6.10551 1.10545 5.85119 1.00006 5.586 1H2C1.73478 1 1.48043 1.10536 1.29289 1.29289C1.10536 1.48043 1 1.73478 1 2V5.586C1.00006 5.85119 1.10545 6.10551 1.293 6.293L5.645 10.645C5.87226 10.8708 6.17962 10.9976 6.5 10.9976C6.82038 10.9976 7.12774 10.8708 7.355 10.645L10.645 7.355C10.8708 7.12774 10.9976 6.82038 10.9976 6.5C10.9976 6.17962 10.8708 5.87226 10.645 5.645L6.293 1.293Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.75 4C3.88807 4 4 3.88807 4 3.75C4 3.61193 3.88807 3.5 3.75 3.5C3.61193 3.5 3.5 3.61193 3.5 3.75C3.5 3.88807 3.61193 4 3.75 4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  tags: (
    <>
      <path
        d="M10 3.33333L14.2 7.53333C14.3492 7.68198 14.4675 7.85861 14.5483 8.05309C14.629 8.24757 14.6706 8.45609 14.6706 8.66667C14.6706 8.87725 14.629 9.08576 14.5483 9.28024C14.4675 9.47473 14.3492 9.65136 14.2 9.8L11.3333 12.6667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.39067 3.724C6.14068 3.47393 5.80159 3.33341 5.448 3.33333H2C1.82319 3.33333 1.65362 3.40357 1.52859 3.5286C1.40357 3.65362 1.33333 3.82319 1.33333 4V7.448C1.33341 7.80159 1.47393 8.14068 1.724 8.39067L5.52667 12.1933C5.82967 12.4944 6.2395 12.6634 6.66667 12.6634C7.09383 12.6634 7.50366 12.4944 7.80667 12.1933L10.1933 9.80667C10.4944 9.50366 10.6634 9.09384 10.6634 8.66667C10.6634 8.2395 10.4944 7.82968 10.1933 7.52667L6.39067 3.724Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.33333 6.66667C4.51743 6.66667 4.66667 6.51743 4.66667 6.33333C4.66667 6.14924 4.51743 6 4.33333 6C4.14924 6 4 6.14924 4 6.33333C4 6.51743 4.14924 6.66667 4.33333 6.66667Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  trendUp: (
    <>
      <path
        d="M14.6667 4.66667L9 10.3333L5.66667 7L1.33334 11.3333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 4.66667H14.6667V8.66667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  trophy: (
    <>
      <path
        d="M4 6H3C2.55798 6 2.13405 5.82441 1.82149 5.51185C1.50893 5.19929 1.33334 4.77536 1.33334 4.33333C1.33334 3.89131 1.50893 3.46738 1.82149 3.15482C2.13405 2.84226 2.55798 2.66667 3 2.66667H4"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6H13C13.442 6 13.866 5.82441 14.1785 5.51185C14.4911 5.19929 14.6667 4.77536 14.6667 4.33333C14.6667 3.89131 14.4911 3.46738 14.1785 3.15482C13.866 2.84226 13.442 2.66667 13 2.66667H12"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66666 14.6667H13.3333"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66666 9.77333V11.3333C6.66666 11.7 6.35333 11.9867 6.02 12.14C5.23333 12.5 4.66666 13.4933 4.66666 14.6667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33334 9.77333V11.3333C9.33334 11.7 9.64667 11.9867 9.98 12.14C10.7667 12.5 11.3333 13.4933 11.3333 14.6667"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1.33333H4V6C4 7.06086 4.42143 8.07828 5.17157 8.82843C5.92172 9.57857 6.93913 10 8 10C9.06087 10 10.0783 9.57857 10.8284 8.82843C11.5786 8.07828 12 7.06086 12 6V1.33333Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
};

export const Icon = ({ name, size = 16, className = '', ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {icons[name]}
    </svg>
  );
};
