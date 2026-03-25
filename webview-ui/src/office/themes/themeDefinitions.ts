export interface ThemePalette {
  floor: string;
  wall: string;
  accent1: string;
  accent2: string;
}

export interface FrontendTheme {
  id: string;
  name: string;
  palette: ThemePalette;
}

export const THEMES: FrontendTheme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    palette: { floor: '#1a0a2e', wall: '#2a1a3e', accent1: '#e94560', accent2: '#00d2ff' },
  },
  {
    id: 'space',
    name: 'Space Station',
    palette: { floor: '#2a2a3a', wall: '#3a3a4a', accent1: '#4a8aff', accent2: '#aaaacc' },
  },
];

export function getThemePalette(themeId: string): ThemePalette | null {
  return THEMES.find((t) => t.id === themeId)?.palette ?? null;
}
