
import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Card } from './types'; // Assuming types are exported from types.ts or similar
import type { Scout } from './data/scouts/index';

// Define the Database
export class GachaDatabase extends Dexie {
    cards!: Table<Card, string>;
    scouts!: Table<Scout, string>;
    assets!: Table<{ id: string; blob: Blob; mimeType: string }, string>;

    constructor() {
        super('GachaAppDB');
        this.version(1).stores({
            cards: 'id, name, rarity',
            scouts: 'id, isActive',
            assets: 'id' // id will be the original URL/Path
        });
    }

    // 1. Sync Data (Critical for UI)
    async seedData(cardsData: Card[], scoutsData: Scout[]) {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log("Seeding data...");

        // Bulk Upsert checks
        await this.cards.bulkPut(cardsData);
        await this.scouts.bulkPut(scoutsData);

        // Cleanup Stale Data
        // Cards
        const codeCardIds = new Set(cardsData.map(c => c.id));
        const dbCardIds = await this.cards.toCollection().primaryKeys();
        const cardsToDelete = dbCardIds.filter(id => !codeCardIds.has(id));
        if (cardsToDelete.length > 0) {
            await this.cards.bulkDelete(cardsToDelete);
        }

        // Scouts
        const codeScoutIds = new Set(scoutsData.map(s => s.id));
        const dbScoutIds = await this.scouts.toCollection().primaryKeys();
        const scoutsToDelete = dbScoutIds.filter(id => !codeScoutIds.has(id));
        if (scoutsToDelete.length > 0) {
            await this.scouts.bulkDelete(scoutsToDelete);
        }

        if (isDev) console.log("Data seeding complete.");
    }

    // 2. Sync Assets (Background)
    async seedAssets(cardsData: Card[], scoutsData: Scout[]) {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log("Background syncing assets...");

        const imageUrls = new Set<string>();
        cardsData.forEach(c => {
            if (c.imageUrl) imageUrls.add(c.imageUrl);
        });
        scoutsData.forEach(s => {
            if (s.bannerImage) imageUrls.add(s.bannerImage);
            if (s.bannerImageHome) imageUrls.add(s.bannerImageHome);
        });

        const existingAssets = new Set(await this.assets.toCollection().primaryKeys());
        const urlsToFetch = Array.from(imageUrls).filter(url => !existingAssets.has(url));

        // Process in batches to avoid network congestion
        const BATCH_SIZE = 5;
        for (let i = 0; i < urlsToFetch.length; i += BATCH_SIZE) {
            const batch = urlsToFetch.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                    const blob = await response.blob();
                    await this.assets.put({
                        id: url,
                        blob: blob,
                        mimeType: blob.type
                    });
                } catch (err) {
                    console.error(`Failed to cache asset ${url}:`, err);
                }
            }));
        }

        if (isDev) console.log("Asset syncing complete.");
    }

}

export const db = new GachaDatabase();
