export const genres = ['lofi', 'geek', 'anime', 'ambient', 'custom'] as const;
export type Genre = (typeof genres)[number];
export const layers = ['rain', 'fire', 'waves', 'wind', 'birds', 'vinyl'] as const;
export type Layer = (typeof layers)[number];
export const sceneIds = ['rain', 'anime', 'forest', 'cabin', 'night-city', 'cloud-room', 'sakura-river', 'moon-train', 'aurora-lake', 'lunar-garden', 'violet-coast', 'starfall'] as const;
export type SceneId = (typeof sceneIds)[number];
export interface Credit { artist: string; composer: string; source: string; license: string; licenseUrl: string; transcoded?: boolean; }
export interface Track { id: string; genre: Genre; title: string; src: string; bpm: number; credit?: Credit; }
const kevin = (isrc: string, composer = 'Kevin MacLeod'): Credit => ({
  artist: 'Kevin MacLeod', composer,
  source: `https://incompetech.com/music/royalty-free/index.html?isrc=${isrc}`,
  license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
});
export const tracks: Track[] = [
  { id: 'dream-culture', genre: 'lofi', title: 'Dream Culture', bpm: 70, src: '/audio/radio/dream-culture.mp3', credit: kevin('USUAN1300046') },
  { id: '8bit-dungeon', genre: 'geek', title: '8bit Dungeon Level', bpm: 106, src: '/audio/radio/8bit-dungeon.mp3', credit: kevin('USUAN1200066') },
  { id: 'gymnopedie-1', genre: 'ambient', title: 'Gymnopédie No. 1', bpm: 77, src: '/audio/radio/gymnopedie-1.mp3', credit: kevin('USUAN1100787', 'Erik Satie') },
  { id: 'clair-de-lune', genre: 'ambient', title: 'Clair de lune', bpm: 0, src: '/audio/radio/clair-de-lune.mp3', credit: {
    artist: 'Laurens Goedhart', composer: 'Claude Debussy',
    source: 'https://commons.wikimedia.org/wiki/File:Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.ogg',
    license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/', transcoded: true,
  } },
  { id: 'after-hours', genre: 'lofi', title: 'After hours', bpm: 76, src: '/audio/radio/after-hours.mp3' },
  { id: 'soft-commits', genre: 'lofi', title: 'Soft commits', bpm: 82, src: '/audio/radio/soft-commits.mp3' },
  { id: 'save-point', genre: 'geek', title: 'Save point', bpm: 88, src: '/audio/radio/save-point.mp3' },
  { id: 'pixel-dreams', genre: 'geek', title: 'Pixel dreams', bpm: 92, src: '/audio/radio/pixel-dreams.mp3' },
  { id: 'last-train', genre: 'anime', title: 'Last train home', bpm: 74, src: '/audio/radio/last-train.mp3' },
  { id: 'paper-lanterns', genre: 'anime', title: 'Paper lanterns', bpm: 80, src: '/audio/radio/paper-lanterns.mp3' },
  { id: 'moss-light', genre: 'ambient', title: 'Moss & light', bpm: 62, src: '/audio/radio/moss-light.mp3' },
  { id: 'slow-orbit', genre: 'ambient', title: 'Slow orbit', bpm: 58, src: '/audio/radio/slow-orbit.mp3' },
  { id: 'chill-wave', genre: 'lofi', title: 'Chill Wave', bpm: 100, src: '/audio/radio/chill-wave.mp3', credit: kevin('USUAN1600048') },
  { id: 'on-the-ground', genre: 'lofi', title: 'On the Ground', bpm: 106, src: '/audio/radio/on-the-ground.mp3', credit: kevin('USUAN1400030') },
  { id: 'cool-vibes', genre: 'lofi', title: 'Cool Vibes', bpm: 83, src: '/audio/radio/cool-vibes.mp3', credit: kevin('USUAN1100863') },
  { id: 'easy-lemon', genre: 'lofi', title: 'Easy Lemon', bpm: 82, src: '/audio/radio/easy-lemon.mp3', credit: kevin('USUAN1200076') },
  { id: 'bit-quest', genre: 'geek', title: 'Bit Quest', bpm: 100, src: '/audio/radio/bit-quest.mp3', credit: kevin('USUAN1500073') },
  { id: 'bit-shift', genre: 'geek', title: 'Bit Shift', bpm: 130, src: '/audio/radio/bit-shift.mp3', credit: kevin('USUAN1600045') },
  { id: 'voxel-revolution', genre: 'geek', title: 'Voxel Revolution', bpm: 122, src: '/audio/radio/voxel-revolution.mp3', credit: kevin('USUAN2000025') },
  { id: 'video-dungeon-crawl', genre: 'geek', title: 'Video Dungeon Crawl', bpm: 89, src: '/audio/radio/video-dungeon-crawl.mp3', credit: kevin('USUAN1200064') },
  { id: 'almost-new', genre: 'anime', title: 'Almost New', bpm: 80, src: '/audio/radio/almost-new.mp3', credit: kevin('USUAN1800008') },
  { id: 'water-lily', genre: 'anime', title: 'Water Lily', bpm: 62, src: '/audio/radio/water-lily.mp3', credit: kevin('USUAN1400035') },
  { id: 'dreamy-flashback', genre: 'anime', title: 'Dreamy Flashback', bpm: 110, src: '/audio/radio/dreamy-flashback.mp3', credit: kevin('USUAN1100532') },
  { id: 'cherry-blossom', genre: 'anime', title: 'Cherry Blossom', bpm: 100, src: '/audio/radio/cherry-blossom.mp3', credit: kevin('USUAN1100382') },
  { id: 'atlantean-twilight', genre: 'ambient', title: 'Atlantean Twilight', bpm: 44, src: '/audio/radio/atlantean-twilight.mp3', credit: kevin('USUAN1100322') },
  { id: 'infinite-perspective', genre: 'ambient', title: 'Infinite Perspective', bpm: 80, src: '/audio/radio/infinite-perspective.mp3', credit: kevin('USUAN1500024') },
  { id: 'comfortable-mystery', genre: 'ambient', title: 'Comfortable Mystery', bpm: 65, src: '/audio/radio/comfortable-mystery.mp3', credit: kevin('USUAN1100287') },
  { id: 'meditation-impromptu-01', genre: 'ambient', title: 'Meditation Impromptu 01', bpm: 0, src: '/audio/radio/meditation-impromptu-01.mp3', credit: kevin('USUAN1100163') },
];

export interface Mix {
  genre: Genre; scene: SceneId; master: number; music: number; musicEnabled: boolean;
  layers: Record<Layer, number>; shuffle: boolean; repeat: boolean; showTimer: boolean;
}
export const defaultMix: Mix = {
  genre: 'lofi', scene: 'anime', master: 65, music: 75, musicEnabled: true,
  layers: { rain: 0, fire: 0, waves: 0, wind: 0, birds: 0, vinyl: 0 },
  shuffle: false, repeat: false, showTimer: false,
};
export function level(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(Math.max(0, Math.min(100, value))) : fallback;
}
/** Stored preferences are untrusted, and can come from older versions. */
export function cleanMix(value: unknown, allowCustom = false): Mix {
  const v = value && typeof value === 'object' ? value as Partial<Mix> : {};
  return {
    genre: genres.includes(v.genre as Genre) && (allowCustom || v.genre !== 'custom') ? v.genre! : defaultMix.genre,
    scene: sceneIds.includes(v.scene as SceneId) ? v.scene! : defaultMix.scene,
    master: level(v.master, defaultMix.master), music: level(v.music, defaultMix.music),
    musicEnabled: typeof v.musicEnabled === 'boolean' ? v.musicEnabled : true,
    layers: Object.fromEntries(layers.map(k => [k, level(v.layers?.[k], defaultMix.layers[k])])) as Record<Layer, number>,
    shuffle: typeof v.shuffle === 'boolean' ? v.shuffle : false,
    repeat: typeof v.repeat === 'boolean' ? v.repeat : false,
    showTimer: typeof v.showTimer === 'boolean' ? v.showTimer : false,
  };
}
