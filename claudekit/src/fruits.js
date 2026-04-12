export const FRUITS = [
  { tier: 0, name: 'Cherry', radius: 12, color: '#E74C3C', points: 1 },
  { tier: 1, name: 'Strawberry', radius: 16, color: '#FF6B6B', points: 3 },
  { tier: 2, name: 'Grapes', radius: 20, color: '#9B59B6', points: 6 },
  { tier: 3, name: 'Dekopon', radius: 26, color: '#F39C12', points: 10 },
  { tier: 4, name: 'Persimmon', radius: 32, color: '#E67E22', points: 15 },
  { tier: 5, name: 'Apple', radius: 36, color: '#E74C3C', points: 21 },
  { tier: 6, name: 'Pear', radius: 42, color: '#A8D648', points: 28 },
  { tier: 7, name: 'Peach', radius: 48, color: '#FDCB6E', points: 36 },
  { tier: 8, name: 'Pineapple', radius: 57, color: '#F1C40F', points: 45 },
  { tier: 9, name: 'Melon', radius: 64, color: '#2ECC71', points: 55 },
  { tier: 10, name: 'Watermelon', radius: 77, color: '#27AE60', points: 66 },
];

// Only the 5 smallest fruits can be randomly selected for dropping
export const DROPPABLE_MAX_TIER = 4;

export function getRandomDroppableTier() {
  return Math.floor(Math.random() * (DROPPABLE_MAX_TIER + 1));
}
