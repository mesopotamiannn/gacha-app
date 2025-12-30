import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { GACHA_COST, RARITY_RATES } from '../data/cards';
import { GIFT_CODES } from '../data/codes';
import type { Scout } from '../data/scouts/index';
import type { Card, Rarity, UserState } from '../types';

// --- TYPES ---
/*
  Card, Rarity, UserState are imported from types.ts
  But UserState in App.tsx had 'userName' and 'usedCodes' which might be missing in types.ts.
  Let's extend UserState locally if needed or update types.ts.
  Looking at types.ts, it has credits, inventory, lastDailyBonus, profileCardId.
  It misses userName and usedCodes. I should update types.ts first or extend it here.
  I will extend it here for now to avoid modifying types.ts multiple times.
*/

interface ExtendedUserState extends UserState {
    userName: string;
    usedCodes: string[];
}

// --- CONSTANTS ---
const RANK_THRESHOLDS = {
    SS: 2500,
    S: 1000,
    A: 200,
    B: 50,
    C: 0
};
const RARITY_POINTS: Record<Rarity, number> = {
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    1: 1
};

// --- CONTEXT ---
interface GameContextType {
    state: ExtendedUserState;
    cards: Card[];
    scouts: Scout[];
    pullGacha: (count?: number, scoutId?: string) => Card[];
    addCredits: (amount: number) => void;
    redeemCode: (code: string) => { success: boolean; message: string };
    getFormattedInventory: () => { card: Card; count: number }[];
    updateProfile: (name: string) => void;
    updateProfileCard: (cardId: string) => void;
    resetData: () => void;
    rankInfo: { rank: string; points: number; nextRankPoints: number | null };
    nextBonusTime: number | null; // Keep for compatibility, though seemingly unused in snippet
    resolveAsset: (path: string) => string;
    dataLoaded: boolean;
    getScoutByCardId: (cardId: string) => Scout | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [scouts, setScouts] = useState<Scout[]>([]);
    const [assets, setAssets] = useState<Record<string, string>>({});
    const [dataLoaded, setDataLoaded] = useState(false);

    const [state, setState] = useState<ExtendedUserState>(() => {
        try {
            const saved = localStorage.getItem('gacha_app_state');
            const parsed = saved ? JSON.parse(saved) : null;
            return parsed ? {
                credits: 0,
                inventory: [],
                lastDailyBonus: null,
                userName: "Guest User",
                profileCardId: null,
                usedCodes: [],
                ...parsed
            } : {
                credits: 0,
                inventory: [],
                lastDailyBonus: null,
                userName: "Guest User",
                profileCardId: null,
                usedCodes: []
            };
        } catch {
            return {
                credits: 0,
                inventory: [],
                lastDailyBonus: null,
                userName: "Guest User",
                profileCardId: null,
                usedCodes: []
            };
        }
    });

    useEffect(() => {
        try { localStorage.setItem('gacha_app_state', JSON.stringify(state)); } catch (e) { console.error(e); }
    }, [state]);

    // Initial Data Load (DB)
    useEffect(() => {
        const initData = async () => {
            try {
                const { db } = await import('../db'); // Adjusted path

                // @ts-ignore
                const { CARDS } = await import('../data/cards');
                // @ts-ignore
                const { SCOUTS } = await import('../data/scouts/index');

                await db.seed(CARDS, SCOUTS);

                const loadedCards = await db.cards.toArray();
                const loadedScouts = await db.scouts.toArray();
                const loadedAssets = await db.assets.toArray();

                const assetMap: Record<string, string> = {};
                loadedAssets.forEach(a => {
                    assetMap[a.id] = URL.createObjectURL(a.blob);
                });

                setCards(loadedCards);
                setScouts(loadedScouts);
                setAssets(assetMap);
                setDataLoaded(true);
            } catch (e) {
                console.error("Failed to load data from DB:", e);
            }
        };
        initData();
    }, []);

    const resolveAsset = (path: string) => {
        return assets[path] || path;
    };

    // Check for daily bonus (0:00 and 12:00 Reset)
    useEffect(() => {
        const checkBonus = () => {
            const now = new Date();
            const currentSlot = new Date(now);
            if (now.getHours() < 12) {
                currentSlot.setHours(0, 0, 0, 0);
            } else {
                currentSlot.setHours(12, 0, 0, 0);
            }

            const lastBonusDate = state.lastDailyBonus ? new Date(state.lastDailyBonus) : null;

            // If no last bonus, OR last bonus is older than current slot
            if (!lastBonusDate || lastBonusDate.getTime() < currentSlot.getTime()) {
                setState(prev => ({
                    ...prev,
                    credits: prev.credits + 100,
                    lastDailyBonus: new Date().toISOString()
                }));
            }
        };

        checkBonus();
        const timer = setInterval(checkBonus, 60000); // Check every minute
        return () => clearInterval(timer);
    }, [state.lastDailyBonus]);

    const nextBonusTime = useMemo(() => {
        const now = new Date();
        const currentSlot = new Date(now);
        if (now.getHours() < 12) {
            currentSlot.setHours(0, 0, 0, 0);
        } else {
            currentSlot.setHours(12, 0, 0, 0);
        }

        const lastBonusDate = state.lastDailyBonus ? new Date(state.lastDailyBonus) : null;

        // If bonus available now (not collected for current slot)
        if (!lastBonusDate || lastBonusDate.getTime() < currentSlot.getTime()) {
            return Date.now();
        }

        // Next bonus is at next slot
        const nextSlot = new Date(currentSlot);
        nextSlot.setHours(nextSlot.getHours() + 12);
        return nextSlot.getTime();
    }, [state.lastDailyBonus]);

    const addCredits = (amount: number) => setState(prev => ({ ...prev, credits: prev.credits + amount }));

    const redeemCode = (code: string): { success: boolean; message: string } => {
        const formattedCode = code.toUpperCase().trim();

        if (state.usedCodes.includes(formattedCode)) {
            return { success: false, message: 'このギフトコードは既に使用されています。' };
        }

        const amount = GIFT_CODES[formattedCode];
        if (!amount) {
            return { success: false, message: '無効なギフトコードです。' };
        }

        setState(prev => ({
            ...prev,
            credits: prev.credits + amount,
            usedCodes: [...prev.usedCodes, formattedCode]
        }));

        return { success: true, message: `${amount} クレジットを獲得しました！` };
    };

    const pullGacha = (count: number = 1, scoutId?: string): Card[] => {
        const totalCost = GACHA_COST * count;
        if (state.credits < totalCost) return [];

        let cardPool = cards;
        if (scoutId) {
            const scout = scouts.find(s => s.id === scoutId);
            if (scout) {
                // Assuming scout.cards is populated correctly
                // If it's not purely ID based in the DB object but the full objects
                cardPool = scout.cards;
            }
        }

        const newCredits = state.credits - totalCost;
        const newCards: Card[] = [];
        const newInventoryIds: string[] = [];

        for (let i = 0; i < count; i++) {
            const rand = Math.random();
            let selectedRarity: Rarity = 1;
            if (rand < RARITY_RATES[1]) selectedRarity = 1;
            else if (rand < RARITY_RATES[1] + RARITY_RATES[2]) selectedRarity = 2;
            else if (rand < RARITY_RATES[1] + RARITY_RATES[2] + RARITY_RATES[3]) selectedRarity = 3;
            else if (rand < RARITY_RATES[1] + RARITY_RATES[2] + RARITY_RATES[3] + RARITY_RATES[4]) selectedRarity = 4;
            else selectedRarity = 5;

            let pool = cardPool.filter(c => c.rarity === selectedRarity);
            if (pool.length === 0) {
                pool = cardPool;
            }

            if (pool.length) {
                const wonCard = pool[Math.floor(Math.random() * pool.length)];
                newCards.push(wonCard);
                newInventoryIds.push(wonCard.id);
            }
        }

        setState(prev => ({ ...prev, credits: newCredits, inventory: [...prev.inventory, ...newInventoryIds] }));
        return newCards;
    };

    const getFormattedInventory = () => {
        const counts: Record<string, number> = {};
        state.inventory.forEach(id => {
            counts[id] = (counts[id] || 0) + 1;
        });

        return Object.keys(counts).map(id => {
            const card = cards.find(c => c.id === id);
            if (!card) return null;
            return { card, count: counts[id] };
        }).filter(Boolean) as { card: Card; count: number }[];
    };

    const updateProfile = (name: string) => {
        setState(prev => ({ ...prev, userName: name }));
    };

    const updateProfileCard = (cardId: string) => {
        setState(prev => ({ ...prev, profileCardId: cardId }));
    };

    const resetData = async () => {
        if (confirm('本当にデータをリセットしますか？この操作は取り消せません。\n（データベースも初期化され、最新のカードデータが再読み込みされます）')) {
            localStorage.removeItem('gacha_app_state');
            try {
                const { db } = await import('../db');
                await db.delete();
            } catch (e) {
                console.error("Failed to delete database:", e);
            }
            window.location.reload();
        }
    };

    const rankInfo = useMemo(() => {
        let points = 0;
        state.inventory.forEach(id => {
            const card = cards.find(c => c.id === id);
            if (card) {
                points += RARITY_POINTS[card.rarity] || 0;
            }
        });

        let rank = 'C';
        let nextRankPoints: number | null = RANK_THRESHOLDS.B;

        if (points >= RANK_THRESHOLDS.SS) { rank = 'SS'; nextRankPoints = null; }
        else if (points >= RANK_THRESHOLDS.S) { rank = 'S'; nextRankPoints = RANK_THRESHOLDS.SS; }
        else if (points >= RANK_THRESHOLDS.A) { rank = 'A'; nextRankPoints = RANK_THRESHOLDS.S; }
        else if (points >= RANK_THRESHOLDS.B) { rank = 'B'; nextRankPoints = RANK_THRESHOLDS.A; }

        return { rank, points, nextRankPoints };
    }, [state.inventory, cards]);

    return (
        <GameContext.Provider value={{
            state,
            cards,
            scouts,
            pullGacha,
            addCredits,
            redeemCode,
            getFormattedInventory,
            updateProfile,
            updateProfileCard,
            resetData,
            rankInfo,
            nextBonusTime,
            resolveAsset,
            dataLoaded,
            getScoutByCardId: (cardId: string) => scouts.find(s => s.cards.some(c => c.id === cardId))
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};
