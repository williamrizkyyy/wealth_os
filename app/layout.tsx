import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Wealth OS · Your personal holding company', description: 'Satu tempat untuk keuangan, bisnis, investasi, dan tujuan hidupmu.', manifest: '/manifest.webmanifest', appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Wealth OS' }, icons: { icon: '/favicon.svg', apple: '/icon-192.png' } };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#f7f8fa' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="id"><body><div className="isolate">{children}</div></body></html>; }
