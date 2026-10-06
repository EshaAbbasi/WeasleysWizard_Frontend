const Logo = ({ size = 44 }) => (
  <svg
    className="w-logo"
    width={size}
    height={size}
    viewBox="-14 0 116 96"
    aria-hidden="true"
  >
    {/* swoosh tail on the left */}
    <path
      d="M-12 60 C-4 40 6 34 20 44 C6 42 -2 46 -12 60 Z"
      fill="currentColor"
    />

    {/* thick stroke 1 + serif */}
    <polygon points="4,12 24,12 41,78 27,78" fill="currentColor" />
    <rect x="-2" y="7" width="32" height="6" rx="1" fill="currentColor" />

    {/* thin stroke 2 */}
    <polygon points="31,78 40,78 54,24 47,24" fill="currentColor" />

    {/* thick stroke 3 + serif */}
    <polygon points="43,14 60,14 73,78 60,78" fill="currentColor" />
    <rect x="38" y="8" width="30" height="6" rx="1" fill="currentColor" />

    {/* lightning bolt as the last stroke */}
    <path
      d="M88 6 L99 6 L86 36 L95 36 L70 90 L74 52 L65 52 Z"
      fill="#d4af37"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
