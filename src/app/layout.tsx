import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "രാസപഞ്ചാധ്യായി | Rasa Panchadyayi",
    template: "%s | Rasa Panchadyayi",
  },
  description:
    "ശ്രീമദ് ഭാഗവതത്തിലെ ദശമസ്കന്ധം 29–33 അധ്യായങ്ങളെ ആസ്പദമാക്കിയുള്ള രാസപഞ്ചാധ്യായിയുടെ മലയാള വ്യാഖ്യാന വായന. Read the Rasa Panchadyayi in Malayalam and explore translations.",
  applicationName: "Rasa Panchadyayi",
  keywords: [
    "രാസപഞ്ചാധ്യായി", "രാസലീല", "ശ്രീമദ് ഭാഗവതം", "Srimad Bhagavatam",
    "Rasa Panchadyayi", "Bhagavata Purana", "Malayalam Bhagavatam",
    "Gopika Geetham", "Gopi Geetham", "Krishna"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ml_IN",
    title: "രാസപഞ്ചാധ്യായി | Rasa Panchadyayi",
    description: "ശ്രീമദ് ഭാഗവതത്തിലെ രാസപഞ്ചാധ്യായിയുടെ മലയാള വായന.",
    siteName: "Rasa Panchadyayi",
  },
  twitter: {
    card: "summary",
    title: "രാസപഞ്ചാധ്യായി | Rasa Panchadyayi",
    description: "ശ്രീമദ് ഭാഗവതത്തിലെ രാസപഞ്ചാധ്യായിയുടെ മലയാള വായന.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#101b1a",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ml">
      <body>{children}</body>
    </html>
  );
}
