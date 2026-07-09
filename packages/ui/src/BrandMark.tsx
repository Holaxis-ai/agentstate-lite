/**
 * The Holaxis chevron mark, inlined (no external image request — the strict CSP and
 * offline-first posture both rule that out). Purely decorative next to the wordmark button in
 * the app header; `aria-hidden` since the header's own text already names the app.
 */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      className="app-mark"
      width={size}
      height={size}
      viewBox="664.63 10.94 342 342"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="app-mark-g0" x1="730.35" y1="181.94" x2="986.39" y2="181.94" gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="#F6CF59" stopOpacity="0" />
          <stop offset="1" stopColor="#F6CF59" />
        </linearGradient>
        <mask id="app-mark-m0" maskUnits="userSpaceOnUse" x="710.35" y="38.39" width="296.04" height="287.1">
          <path fill="white" d="M858.37 58.39L986.39 181.94L858.37 305.49Z" />
          <path fill="black" d="M846.94 58.39L974.96 181.94L846.94 305.49L718.92 181.94Z" />
        </mask>
        <linearGradient id="app-mark-g2" x1="707.49" y1="181.94" x2="963.53" y2="181.94" gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="#24A898" stopOpacity="0" />
          <stop offset="1" stopColor="#24A898" />
        </linearGradient>
        <mask id="app-mark-m2" maskUnits="userSpaceOnUse" x="687.49" y="38.39" width="296.04" height="287.1">
          <path fill="white" d="M835.51 58.39L963.53 181.94L835.51 305.49Z" />
          <path fill="black" d="M824.08 58.39L952.1 181.94L824.08 305.49L696.06 181.94Z" />
        </mask>
        <linearGradient id="app-mark-g4" x1="684.63" y1="181.94" x2="940.67" y2="181.94" gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="#3892CD" stopOpacity="0" />
          <stop offset="1" stopColor="#3892CD" />
        </linearGradient>
        <mask id="app-mark-m4" maskUnits="userSpaceOnUse" x="664.63" y="38.39" width="296.04" height="287.1">
          <path fill="white" d="M812.65 58.39L940.67 181.94L812.65 305.49Z" />
          <path fill="black" d="M801.22 58.39L929.24 181.94L801.22 305.49L673.2 181.94Z" />
        </mask>
      </defs>
      <rect x="730.35" y="58.39" width="256.04" height="247.1" fill="url(#app-mark-g0)" mask="url(#app-mark-m0)" />
      <rect x="707.49" y="58.39" width="256.04" height="247.1" fill="url(#app-mark-g2)" mask="url(#app-mark-m2)" />
      <rect x="684.63" y="58.39" width="256.04" height="247.1" fill="url(#app-mark-g4)" mask="url(#app-mark-m4)" />
    </svg>
  );
}
