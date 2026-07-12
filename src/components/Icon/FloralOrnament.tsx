const FloralOrnament = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 120 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 12 H40" />
      <path d="M80 12 H118" />
      <circle cx="60" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M60 12 C52 4, 44 4, 40 12 C44 20, 52 20, 60 12 Z" />
      <path d="M60 12 C68 4, 76 4, 80 12 C76 20, 68 20, 60 12 Z" />
    </svg>
  )
}

export default FloralOrnament
