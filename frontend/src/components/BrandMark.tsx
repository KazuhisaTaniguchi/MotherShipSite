export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 128 128" aria-hidden="true">
      <defs>
        <linearGradient id="bm" x2="1" y2="1">
          <stop stopColor="#1e3ec0" />
          <stop offset=".55" stopColor="#385cf4" />
          <stop offset="1" stopColor="#38afee" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="27" fill="url(#bm)" />
      <path d="M60 28 22 86 49 80 60 91 60 75 48 70 60 54Z" fill="#fff" />
      <path d="M68 28 106 86 79 80 68 91 68 75 80 70 68 54Z" fill="#a8f8ff" />
      <path d="M64 86 72 98 64 105 56 98Z" fill="#fff" />
    </svg>
  );
}
