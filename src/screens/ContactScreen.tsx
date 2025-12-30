import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ContactScreen: React.FC = () => {
    const navigate = useNavigate();

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
                    お問い合わせ・運営者情報
                </h2>
            </div>

            {/* Creator Profile */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    marginTop: '0',
                    marginBottom: '1rem'
                }}>
                    運営者
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '1rem'
                }}>
                    I'm only a Fighters fan.<br />
                </p>
                <div style={{
                    padding: '0.75rem',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#64748b'
                }}>
                    <strong style={{ color: '#0f172a' }}>注意事項:</strong><br />
                    このアプリは非営利・非商用で運営されています。該当チア及びプロ野球球団公式とは一切関係ありません。
                </div>
            </div>

            {/* SNS Links */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    marginTop: '0',
                    marginBottom: '1rem'
                }}>
                    SNS
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Twitter/X Link */}
                    <a
                        href="https://twitter.com/mesopotamiannnn"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#000000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>X</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@mesopotamiannnn</div>
                        </div>
                    </a>

                    {/* Email Link */}
                    {/*
                    <a
                        href="mailto:your.email@example.com"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Mail size={20} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>メール</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>your.email@example.com</div>
                        </div>
                    </a>
                    */}
                </div>
            </div>

            {/* Additional Info */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    margin: '0'
                }}>
                    お問い合わせ・バグ報告
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    lineHeight: 1.6
                }}>
                    本アプリに関するバグ不具合等を発見した場合や機御意見・御感想・御要望等がある場合は、上記のSNSからご連絡ください。
                </p>
            </div>
        </div>
    );
};

export default ContactScreen;
