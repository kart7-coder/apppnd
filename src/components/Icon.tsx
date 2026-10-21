const PATHS: Record<string, string> = {
  back: 'M15 18l-6-6 6-6',
  play: 'M7 4.5v15l13-7.5z',
  pause: 'M7 4h4v16H7zM14 4h4v16h-4z',
  restart: 'M4 4v6h6M4.5 15a8 8 0 1 0 2-8.5L4 10',
  prev: 'M6 5v14M19 5L9 12l10 7z',
  next: 'M18 5v14M5 5l10 7-10 7z',
  loop: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  home: 'M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  tuner: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 12l4-5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  heart: 'M12 21s-7.5-4.6-9.5-9.2C1 8 3.5 4 7.3 4c2 0 3.5 1.1 4.7 2.7C13.2 5.1 14.7 4 16.7 4 20.5 4 23 8 21.5 11.8 19.5 16.4 12 21 12 21z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  sound: 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  check: 'M5 12l5 5L20 7',
  whatsapp: 'M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1-.5-2.5-2-3-3l1-1-1-2z',
  logout: 'M15 4h4v16h-4M10 17l5-5-5-5M15 12H3',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  hand: 'M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3 13.5a1.5 1.5 0 0 1 2.5-1.6L8 15',
  chevron: 'M9 6l6 6-6 6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
}

export function Icon({ name, size = 22 }: { name: keyof typeof PATHS | string; size?: number }) {
  const filled = name === 'play' || name === 'pause' || name === 'prev' || name === 'next'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? ''} />
    </svg>
  )
}
