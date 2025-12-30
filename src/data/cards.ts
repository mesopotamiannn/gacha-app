import type { Card } from '../types';

// Placeholder images (can be replaced with generated assets later)
// const PLACEHOLDER_IMG = 'https://placehold.co/400x600/1e293b/f8fafc?text=Card';

import { VOL1_CARDS } from './cards/vol1';
import { VOL2_CARDS } from './cards/vol2';
import { SCOUTS } from './scouts';


// Aggregate all cards for global lookups (like My Page / Inventory)
export const CARDS: Card[] = [
    ...VOL1_CARDS,
    ...VOL2_CARDS
];

export { SCOUTS };


export const RARITY_RATES: Record<number, number> = {
    1: 0.50,
    2: 0.30,
    3: 0.15,
    4: 0.045,
    5: 0.005,
};

export const GACHA_COST = 10;
