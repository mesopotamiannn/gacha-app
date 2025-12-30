import type { Card } from '../../types';
import { IMAGE_VERSION } from '../config';

// Example placeholder data for Volume 2
const RAW_CARDS: Card[] = [
    //{ id: 'v2_c1', name: 'サッポロクラシック', rarity: 2, imageUrl: '/cards/vol2/beer_2_20250305.jpg', description: '800円' },
    //{ id: 'v2_c2', name: '竹市琴美 (Summer)', rarity: 4, imageUrl: '/cards/kotomi_summer_sr.jpg', description: '2025 Summer Special' },
    //{ id: 'v2_c3', name: '新井田愛理 (Summer)', rarity: 3, imageUrl: '/cards/airi_summer_r.jpg', description: '2025 Summer Special' },
];

export const VOL2_CARDS = RAW_CARDS.map(card => ({
    ...card,
    imageUrl: `${card.imageUrl}?v=${IMAGE_VERSION.CARDS_VOL2}`
}));
