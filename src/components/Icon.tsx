import type { SVGProps } from 'react';
const paths = {
  home: <>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v12h5v-7h4v7h5V9" />
  </>,
  bookmark: <path d="M6 4h12v17l-6-4-6 4V4Z" />,
  report: <>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4V2h6v2M9 10h6m-6 4h6m-6 4h3" />
  </>,
  info: <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6m0-10v.1" />
  </>,
  search: <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m16 16 5 5" />
  </>,
  pin: <>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </>,
  calendar: <>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M8 3v4m8-4v4M4 11h16m-12 4h2m4 0h2m-8 3h2" />
  </>,
  grid: <>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="3" y="15" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
  </>,
  chevron: <path d="m6 9 6 6 6-6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  back: <path d="M20 12H4m6-6-6 6 6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  circle: <circle cx="12" cy="12" r="8" />,
  checkCircle: <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </>,
  tag: <>
    <path d="m3 3 9 .1 9 9-9 9-9-9V3Z" />
    <circle cx="7.5" cy="7.5" r=".8" />
  </>,
  file: <>
    <path d="M14 3H5v18h14V8l-5-5Z" />
    <path d="M14 3v6h5M8 13h8m-8 4h5" />
  </>,
  image: <>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="15.5" cy="8.5" r="1.5" />
    <path d="m3 16 5-5 5 5 3-3 5 5" />
  </>,
  send: <path d="m21 3-7 18-4-7-7-4 18-7ZM21 3 10 14" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  trash: <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" />,
  phone: <path d="m5 3 4 1 1 5-3 2a15 15 0 0 0 6 6l2-3 5 1 1 4c-1 4-8 3-13-2S1 4 5 3Z" />,
  building: <path d="M5 21V3h14v18M2 21h20M9 7h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1m-4 6v-3h2v3" />,
  layers: <path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" />,
  users: <>
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21v-3a7 7 0 0 1 14 0v3H5Zm14-18a4 4 0 0 1 0 8m2 3a6 6 0 0 1 2 5M5 3a4 4 0 0 0 0 8m-2 3a6 6 0 0 0-2 5" />
  </>,
  code: <path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18" />,
  external: <path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7" />,
  headphones: <>
    <path d="M4 14v-3a8 8 0 0 1 16 0v3" />
    <rect x="3" y="12" width="5" height="9" rx="2" />
    <rect x="16" y="12" width="5" height="9" rx="2" />
  </>,
  bag: <>
    <rect x="4" y="7" width="16" height="14" rx="3" />
    <path d="M8 7V6a4 4 0 0 1 8 0v1M8 12v1m8-1v1" />
  </>,
  key: <>
    <circle cx="8" cy="8" r="5" />
    <path d="m12 12 9 9m-5-5 3-3m0 6 3-3" />
  </>,
  card: <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5 16c0-3 6-3 6 0m3-6h5m-5 4h4" />
  </>,
  wallet: <>
    <path d="M20 8V5H5a3 3 0 0 0-3 3v11a2 2 0 0 0 2 2h16V8H5a3 3 0 0 1-3-3V4" />
    <path d="M20 12h-6v5h6m-4-2.5h.1" />
  </>,
  box: <path d="m12 2 10 5v11l-10 5-10-5V7l10-5ZM2 7l10 5 10-5M12 12v11M7 4.5l10 5" />
} as const;
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
}) {
  return <svg width={`${size / 16}rem`} height={`${size / 16}rem`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    {paths[name]}
  </svg>;
}
