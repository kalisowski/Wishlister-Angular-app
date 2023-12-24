export interface TagItem {
  label: string;
  value: string;
  items?: TagItem[];
}

export const groupedTags: TagItem[] = [
  {
    label: 'General',
    value: 'General',
    items: [
      { label: 'Open World', value: 'Open World' },
      { label: 'Sandbox', value: 'Sandbox' },
      { label: 'Exploration', value: 'Exploration' },
      { label: 'Adventure', value: 'Adventure' },
      { label: 'Simulation', value: 'Simulation' },
      { label: 'Racing', value: 'Racing' },
      { label: 'Puzzle', value: 'Puzzle' },
      { label: 'Indie', value: 'Indie' },
      { label: 'Casual', value: 'Casual' },
      { label: 'Anime', value: 'Anime' },
      { label: 'Post-Apocalyptic', value: 'Post-Apocalyptic' },
      { label: 'Steampunk', value: 'Steampunk' },
      { label: 'Lovecraftian', value: 'Lovecraftian' },
      { label: 'Cyberpunk', value: 'Cyberpunk' },
      { label: 'Historical Fiction', value: 'Historical Fiction' },
      { label: 'Medieval', value: 'Medieval' },
      { label: 'Fantasy', value: 'Fantasy' },
      { label: 'Tactical', value: 'Tactical' },
      { label: 'Shooter', value: 'Shooter' },
      { label: 'Survival', value: 'Survival' },
      { label: 'Horror', value: 'Horror' },
      { label: 'Strategy', value: 'Strategy' },
      { label: 'Futuristic', value: 'Futuristic' },
      { label: 'Sci-Fi', value: 'Sci-Fi' },
      { label: 'Space Exploration', value: 'Space Exploration' },
    ],
  },
  {
    label: 'POV',
    value: 'POV',
    items: [
      { label: 'First-Person', value: 'First-Person' },
      { label: 'Third-Person', value: 'Third-Person' },
    ],
  },
  {
    label: 'Player Support',
    value: 'Player Support',
    items: [
      { label: 'Multi Player', value: 'Multi Player' },
      { label: 'Single Player', value: 'Single Player' },
      { label: 'Cooperative', value: 'Cooperative' },
      { label: 'Competitive', value: 'Competitive' },
      { label: 'MMORPG', value: 'MMORPG' },
      { label: 'MOBA', value: 'MOBA' },
    ],
  },
];
