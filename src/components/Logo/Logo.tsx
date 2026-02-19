type LogoProps = {
  size?: number;
  color?: string;
};

export function Logo({ size = 40, color = 'currentColor' }: LogoProps) {
  return (
    <svg
      width={size * 5}
      height={size}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
      aria-label="Tax Calculator logo"
    >
      <rect x="0" y="8" width="24" height="24" rx="6" fill="currentColor" />
      <text
        x="12"
        y="25"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="#fff"
        fontFamily="Inter, system-ui, sans-serif"
      >
        %
      </text>

      <text
        x="34"
        y="26"
        fontSize="18"
        fontWeight="600"
        letterSpacing="-0.02em"
        fill="currentColor"
        fontFamily="Inter, system-ui, sans-serif"
      >
        Tax Calculator
      </text>
    </svg>
  );
}
