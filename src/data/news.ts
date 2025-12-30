export type NewsCategory = 'update' | 'maintenance' | 'event' | 'info';

export interface NewsItem {
    id: string;
    date: string;
    title: string;
    category: NewsCategory;
    content?: string;
    url?: string;
}

export const NEWS: NewsItem[] = [
    {
        id: 'n1',
        date: '2025.12.30',
        title: 'サービス開始',
        category: 'info',
        content: 'ブラウザ上でデジタルカードを楽しめるFG 2025 UNOFFICIAL COLLECTIONを公開しました。'
    },
];
