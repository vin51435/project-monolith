import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '6-Day PPL + Night Routine | 6 kg Dumbbell Program',
  description: 'Complete 6-Day Push/Pull/Legs workout routine designed for 6 kg dumbbells, pull-up bar, and bodyweight. Includes daily night routine, progression guide, glossary, and full execution cues.',
  keywords: ['PPL workout', '6kg dumbbells', 'pull-up program', 'home workout', 'muscle hypertrophy', 'exercise library'],
  authors: [{ name: 'Antigravity Fitness' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-900 text-slate-100 pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}
