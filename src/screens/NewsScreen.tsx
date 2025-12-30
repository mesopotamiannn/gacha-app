import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { NEWS, type NewsCategory } from '../data/news';

const NewsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');

    // Sort news by date (newest first)
    const sortedNews = [...NEWS].sort((a, b) => {
        // Convert date string (YYYY.MM.DD) to comparable format
        const dateA = new Date(a.date.replace(/\./g, '-'));
        const dateB = new Date(b.date.replace(/\./g, '-'));
        return dateB.getTime() - dateA.getTime();
    });

    const filteredNews = selectedCategory === 'all'
        ? sortedNews
        : sortedNews.filter(item => item.category === selectedCategory);

    // Check if news is new (within 7 days)
    const isNew = (dateStr: string): boolean => {
        const newsDate = new Date(dateStr.replace(/\./g, '-'));
        const now = new Date();
        const diffTime = now.getTime() - newsDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
    };

    const getCategoryColor = (category: NewsCategory): string => {
        switch (category) {
            case 'update': return '#3b82f6';
            case 'maintenance': return '#f59e0b';
            case 'event': return '#ec4899';
            case 'info': return '#10b981';
            default: return '#64748b';
        }
    };

    const getCategoryLabel = (category: NewsCategory): string => {
        switch (category) {
            case 'update': return '更新';
            case 'maintenance': return 'メンテ';
            case 'event': return 'イベント';
            case 'info': return 'お知らせ';
            default: return '';
        }
    };

    return (
        <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.5rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#64748b'
                    }}
                >
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{
                    fontSize: '1.5rem',
                    borderLeft: '4px solid #275b91',
                    paddingLeft: '0.5rem',
                    margin: 0,
                    color: '#1e293b',
                    flex: 1
                }}>
                    お知らせ
                </h2>
            </div>

            {/* Category Filter */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem'
            }}>
                <button
                    onClick={() => setSelectedCategory('all')}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectedCategory === 'all' ? '#275b91' : '#f1f5f9',
                        color: selectedCategory === 'all' ? 'white' : '#64748b',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    すべて
                </button>
                {(['update', 'event', 'maintenance', 'info'] as NewsCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: 'none',
                            background: selectedCategory === cat ? getCategoryColor(cat) : '#f1f5f9',
                            color: selectedCategory === cat ? 'white' : '#64748b',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {getCategoryLabel(cat)}
                    </button>
                ))}
            </div>

            {/* News List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredNews.map(item => (
                    <div
                        key={item.id}
                        style={{
                            background: 'white',
                            borderRadius: '8px',
                            padding: '1rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                                style={{
                                    background: getCategoryColor(item.category),
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {getCategoryLabel(item.category)}
                            </span>
                            {isNew(item.date) && (
                                <span
                                    style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px',
                                        fontSize: '0.65rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    NEW
                                </span>
                            )}
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                {item.date}
                            </span>
                        </div>
                        <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#0f172a',
                            margin: '0.5rem 0'
                        }}>
                            {item.title}
                        </h3>
                        {item.content && (
                            <div
                                style={{
                                    fontSize: '0.85rem',
                                    color: '#64748b',
                                    lineHeight: 1.6,
                                    margin: '0.5rem 0 0 0'
                                }}
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        )}
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    color: '#275b91',
                                    fontSize: '0.85rem',
                                    textDecoration: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                詳細を見る →
                            </a>
                        )}
                    </div>
                ))}
            </div>

            {filteredNews.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#94a3b8'
                }}>
                    お知らせはありません
                </div>
            )}
        </div>
    );
};

export default NewsScreen;
