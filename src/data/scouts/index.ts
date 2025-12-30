import type { Card } from '../../types';

export interface Scout {
    id: string;
    title: string;
    description: string;
    note: string;
    bannerImage: string;
    bannerImageHome: string;
    cards: Card[];
    cost: number;
    isActive: boolean;
    mainColor: string;
    subColor: string;
}

// Will be populated by importing from specific card files
import { VOL1_CARDS } from '../cards/vol1';
import { VOL2_CARDS } from '../cards/vol2';
import { IMAGE_VERSION } from '../config';


export const SCOUTS: Scout[] = [
    {
        id: 'vol1',
        title: 'FG 2025 UNOFFICIAL COLLECTION',
        description: '「FG 2025 UNOFFICIAL COLLECTION」です。\n2025年主にエスコンフィールドで行われた試合等で撮影したFGの厳選ショット！\nレアリティ★1～★5のデジタルカード200種類以上を収録。\n新規デザインカードを随時追加予定。',
        note: '本サービスのデジタルカードは、個人の趣味として撮影編集をしたものです。\n肖像権名称等の権利は該当チア及び該当球団に帰属します。',
        bannerImage: `/assets/scout_banner.png?v=${IMAGE_VERSION.BANNER}`,
        bannerImageHome: `/assets/scout_banner_home.png?v=${IMAGE_VERSION.BANNER}`,
        cards: VOL1_CARDS,
        cost: 10,
        isActive: true,
        mainColor: '#275b91',
        subColor: '#1e40af'
    },
    {
        id: 'vol2',
        title: '2025 PERSONAL COLLECTION',
        description: '「2025 PERSONAL COLLECTION」です。\n個人的2025年エスコン観戦記！\nえふめしや試合の特別な瞬間を記録したデジタルカード100種以上を収録。\n新規デザインカードを随時追加予定。',
        note: '本サービスのデジタルカードは、個人の趣味として撮影編集をしたものです。\n肖像権名称等の権利は該当選手及び該当球団に帰属します。\n収録された飲食物はすべて2025年シーズンの販売状況、価格となります。',
        bannerImage: `/assets/scout_banner_summer.png?v=${IMAGE_VERSION.BANNER}`, // Placeholder
        bannerImageHome: `/assets/scout_banner_summer_home.png?v=${IMAGE_VERSION.BANNER}`,
        cards: VOL2_CARDS,
        cost: 5,
        isActive: false, // Set to false later if needed, but true for demo
        mainColor: '#275b91',
        subColor: '#FFF'
    }
];
