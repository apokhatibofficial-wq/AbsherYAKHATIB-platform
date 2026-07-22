interface GenderAvatarProps {
  size: number;
  className?: string;
}

export function FemaleAvatarIllustration({ size, className }: GenderAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className}>
      <circle cx="100" cy="100" r="100" fill="#E1E5E2" />
      <path d="M35 200c0-38 27-62 65-62s65 24 65 62z" fill="#0B6B4A" />
      <path
        d="M100 28c-38 0-56 32-56 70v70l30-26 26 30 26-30 30 26v-70c0-38-18-70-56-70z"
        fill="#3F5750"
      />
      <ellipse cx="100" cy="92" rx="36" ry="40" fill="#FAFBFA" />
      <circle cx="83" cy="96" r="15" fill="none" stroke="#C7CDC9" strokeWidth="4" />
      <circle cx="117" cy="96" r="15" fill="none" stroke="#C7CDC9" strokeWidth="4" />
      <path d="M98 96q2-4 4 0" stroke="#C7CDC9" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M89 116q11 9 22 0" stroke="#C7CDC9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function MaleAvatarIllustration({ size, className }: GenderAvatarProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className}>
      <circle cx="100" cy="100" r="100" fill="#EDEFED" />
      <path d="M38 200c0-36 26-58 62-58s62 22 62 58z" fill="#0B6B4A" />
      <ellipse cx="63" cy="105" rx="10" ry="16" fill="#FAFBFA" />
      <ellipse cx="137" cy="105" rx="10" ry="16" fill="#FAFBFA" />
      <ellipse cx="100" cy="100" rx="40" ry="44" fill="#FAFBFA" />
      <path
        d="M60 92c-2-34 20-56 40-56s42 16 42 44c-14-10-24-4-30-14-8 14-30 10-52 26z"
        fill="#3F5750"
      />
      <path d="M89 124q11 9 22 0" stroke="#C7CDC9" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
