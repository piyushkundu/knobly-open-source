import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import KnoblyAI from "@/components/ai/KnoblyAI";
import FirestoreErrorGuard from "@/components/FirestoreErrorGuard";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Knobly Web — O-Level & Python Learning Platform | Free Notes, MCQ, Cyber Security',
    template: '%s | Knobly Web',
  },
  description: 'Knobly Web — India ka best free learning platform for O-Level IT Tools (M1-R5), Python Programming (M3-R5), Cyber Security, Web Design, HTML/CSS/JS, MCQ practice, handwritten notes, aur exam preparation.',
  keywords: [
    'Knobly Web', 'O-Level', 'NIELIT', 'Python programming', 'IT Tools', 'M1-R5', 'M3-R5',
    'cyber security', 'web design', 'HTML', 'CSS', 'JavaScript', 'MCQ', 'free notes',
    'handwritten notes', 'exam preparation', 'O-Level notes', 'Python notes', 'CCC exam',
    'computer course', 'online learning', 'free study material', 'O-Level syllabus',
    'Python tutorial Hindi', 'IT tools notes', 'O-Level Python', 'NIELIT O-Level',
  ],
  authors: [{ name: 'Knobly Web Team' }],
  creator: 'Knobly Web',
  publisher: 'Knobly Web',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'http://localhost:3000',
    siteName: 'Knobly Web',
    title: 'Knobly Web — O-Level & Python Learning Platform',
    description: 'Free O-Level IT Tools, Python Programming, Cyber Security notes, MCQ tests, and study materials. Best learning platform for NIELIT O-Level exam preparation.',
    images: [
      {
        url: '/sample-assets/placeholder.svg',
        width: 1200,
        height: 630,
        alt: 'Knobly Web — Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knobly Web — O-Level & Python Learning Platform',
    description: 'Free O-Level IT Tools, Python, Cyber Security notes & MCQ tests.',
    images: ['/sample-assets/placeholder.svg'],
  },
  icons: {
    icon: [
      { url: '/sample-assets/placeholder.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/sample-assets/placeholder.svg' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'http://localhost:3000',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('knobly-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@700;800;900&display=swap" rel="stylesheet" />
        <script src="https://unpkg.com/@phosphor-icons/web" defer></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.35.0/dist/tabler-icons.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <FirestoreErrorGuard />
            {children}
            <KnoblyAI />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
