export function EvolveLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 24"
      height={24}
      className={className}
      role="img"
      aria-label="Evolve Talent"
    >
      <title>Evolve Talent</title>
      <text
        x="0"
        y="18"
        fontFamily="var(--font-heading)"
        fontSize="19"
        fontWeight="600"
        letterSpacing="-0.02em"
        fill="#123F36"
      >
        evolve
      </text>
    </svg>
  )
}
