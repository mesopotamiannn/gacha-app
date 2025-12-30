
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

    // Seeding Logic
    async seed(cardsData: Card[], scoutsData: Scout[]) {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log("Seeding/Syncing database...");

        // 1. Sync Cards (Upsert)
        await this.cards.bulkPut(cardsData);

        // 2. Sync Scouts (Upsert)
        await this.scouts.bulkPut(scoutsData);

        // 3. Sync Images (Assets)
        const imageUrls = new Set<string>();
        cardsData.forEach(c => {
            if (c.imageUrl) imageUrls.add(c.imageUrl);
        });
        scoutsData.forEach(s => {
            if (s.bannerImage) imageUrls.add(s.bannerImage);
            if (s.bannerImageHome) imageUrls.add(s.bannerImageHome);
        });

        // Fetch and store blobs ONLY if missing
        const existingAssets = new Set(await this.assets.toCollection().primaryKeys());

        for (const url of imageUrls) {
            if (existingAssets.has(url)) {
                continue;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                const blob = await response.blob();
                await this.assets.put({
                    id: url,
                    blob: blob,
                    mimeType: blob.type
                });
                if (isDev) console.log(`Cached missing asset: ${url}`);
            } catch (err) {
                console.error(`Failed to cache asset ${url}:`, err);
            }
        }

        // 4. Cleanup Stale Data
        // Cards
        const codeCardIds = new Set(cardsData.map(c => c.id));
        const dbCardIds = await this.cards.toCollection().primaryKeys();
        const cardsToDelete = dbCardIds.filter(id => !codeCardIds.has(id));
        if (cardsToDelete.length > 0) {
            if (isDev) console.log(`Deleting ${cardsToDelete.length} stale cards...`);
            await this.cards.bulkDelete(cardsToDelete);
        }

        // Scouts
        const codeScoutIds = new Set(scoutsData.map(s => s.id));
        const dbScoutIds = await this.scouts.toCollection().primaryKeys();
        const scoutsToDelete = dbScoutIds.filter(id => !codeScoutIds.has(id));
        if (scoutsToDelete.length > 0) {
            if (isDev) console.log(`Deleting ${scoutsToDelete.length} stale scouts...`);
            await this.scouts.bulkDelete(scoutsToDelete);
        }

        if (isDev) console.log("Seeding/Syncing complete.");
    }

}

export const db = new GachaDatabase();
