interface Props { small?: boolean }

export function Leaf({ small = false }: Props) {
  return (
    <svg width={small ? 22 : 32} height={small ? 22 : 32} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M26 4C12 2 3 9 5 19c1 6 8 10 14 6C28 20 26 4 26 4Z" fill="currentColor" />
      <path d="m8 27 13-16M14 19l-1-6m1 6 6 1" stroke="var(--leaf-line, #fff)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
