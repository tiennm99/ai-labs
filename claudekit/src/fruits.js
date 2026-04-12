// Community-standard fruit stats (TomboFry/moonfloof clones, Suika Game Wiki).
// Radii scaled from the standard (24..192) by 0.52 to fit our 400px container.
// Points match the Nintendo Switch scoring: 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66.
export const FRUITS = [
  { tier: 0, name: 'Cherry', radius: 12, color: '#E8373B', points: 1 },
  { tier: 1, name: 'Strawberry', radius: 17, color: '#FF6B6B', points: 3 },
  { tier: 2, name: 'Grape', radius: 21, color: '#7B52AB', points: 6 },
  { tier: 3, name: 'Dekopon', radius: 29, color: '#FF8C00', points: 10 },
  { tier: 4, name: 'Persimmon', radius: 33, color: '#E2611C', points: 15 },
  { tier: 5, name: 'Apple', radius: 37, color: '#C0392B', points: 21 },
  { tier: 6, name: 'Pear', radius: 44, color: '#C8D44E', points: 28 },
  { tier: 7, name: 'Peach', radius: 50, color: '#FFBF8C', points: 36 },
  { tier: 8, name: 'Pineapple', radius: 67, color: '#F5C518', points: 45 },
  { tier: 9, name: 'Melon', radius: 83, color: '#90C040', points: 55 },
  { tier: 10, name: 'Watermelon', radius: 100, color: '#3A7D44', points: 66 },
];

// Only the 5 smallest fruits can be randomly selected for dropping
export const DROPPABLE_MAX_TIER = 4;

export function getRandomDroppableTier() {
  return Math.floor(Math.random() * (DROPPABLE_MAX_TIER + 1));
}
