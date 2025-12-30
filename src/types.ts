export type Rarity = 1 | 2 | 3 | 4 | 5;

export interface Card {
    id: string;
    name: string;
    rarity: Rarity;
    imageUrl: string;
    description: string;
}

export interface UserState {
    credits: number;
    inventory: string[]; // List of Card IDs
    lastDailyBonus: string | null;
    profileCardId: string | null; // New: Profile Card ID
    userName: string;
    usedCodes: string[];
}
