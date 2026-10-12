// Small controls share the site's simple round-ended outline language.
const paths = {
  play: 'M8 5v14l11-7z', pause: 'M8 5v14M16 5v14',
  next: 'M5 5v14l10-7zM19 5v14', previous: 'M19 5v14L9 12zM5 5v14',
  volume: 'M11 4L5 9H2v6h3l6 5zM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
  mute: 'M11 4L5 9H2v6h3l6 5zM16 9l6 6M22 9l-6 6',
  shuffle: 'M3 6h3l12 12h3M18 15l3 3-3 3M3 18h3l4-4M14 10l4-4h3M18 3l3 3-3 3',
  repeat: 'M4 10V7h14l-3-3M20 14v3H6l3 3M15 10l3-3M9 14l-3 3',
  expand: 'M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  plus: 'M12 5v14M5 12h14', close: 'M6 6l12 12M18 6L6 18',
  rain: 'M5 14a5 5 0 1 1 1-10 6 6 0 0 1 11 2 4 4 0 0 1 1 8M6 17l-1 3M12 17l-1 3M18 17l-1 3',
  fire: 'M13 2s2 6-2 8c-3-1-3-4-3-4s-5 5-4 10a8 8 0 0 0 16-1c0-5-4-8-4-8s1 5-3 6',
  waves: 'M2 7q3-4 6 0t6 0 6 0M2 12q3-4 6 0t6 0 6 0M2 17q3-4 6 0t6 0 6 0',
  wind: 'M2 8h13a3 3 0 1 0-3-3M2 12h18a2 2 0 1 0-2-2M2 16h10a3 3 0 1 1-3 3',
  birds: 'M3 10q5-4 9 2 4-6 9-2M12 12v6',
  vinyl: 'M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 12a7 7 0 0 1 7-7',
} as const;
export default function Glyph({ name }: { name: keyof typeof paths }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
