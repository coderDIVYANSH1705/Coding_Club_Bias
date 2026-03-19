import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. Base URL for relative image paths (Change this to your actual production domain later)
  metadataBase: new URL('https://codingclub.birlainstitute.co.in/'), 
  
  // 2. Title Template: Automatically formats subpages (e.g., "Events | BIAS Coding Club")
  title: {
    default: "BIAS Coding Club | Birla Institute of Applied Sciences",
    template: "%s | BIAS Coding Club",
  },
  
  // 3. Core Description
  description: "The official coding club of Birla Institute of Applied Sciences. We architect the standards for the next generation of engineers, mastering everything from VHDL to Next.js and AI.",
  
  // 4. Keywords to capture organic search traffic
  keywords: [
    "BIAS",
    "Birla Institute of Applied Sciences",
    "Coding Club",
    "B.Tech",
    "Computer Science",
    "Web Development",
    "Next.js",
    "Hackathons",
    "Tech Ecosystem"
  ],
  
  // 5. Author info
  authors: [{ name: "BIAS Coding Club" }],
  creator: "BIAS Coding Club",
  
  // 6. OpenGraph (How the link looks when shared on LinkedIn, WhatsApp, Discord)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://codingclub.birlainstitute.co.in/",
    title: "BIAS Coding Club | Innovate. Deploy. Scale.",
    description: "Join the digital arsenal at Birla Institute of Applied Sciences. Build production-grade projects, master modern stacks, and scale your engineering skills.",
    siteName: "BIAS Coding Club",
    images: [
      {
        url: "/og-image.jpg", // Create a 1200x630px image and put it in your /public folder
        width: 1200,
        height: 630,
        alt: "BIAS Coding Club Hero Banner",
      },
    ],
  },
  
  // 7. Twitter Cards (How the link looks on X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "BIAS Coding Club",
    description: "Innovate. Deploy. Scale. The official tech community of Birla Institute of Applied Sciences.",
    images: ["/og-image.jpg"],
  },
  
  // 8. Crawler instructions
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
  
  // 9. Verification (Optional but recommended for Google Search Console)
  verification: {
    google: "your-google-site-verification-code", // Get this from Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-white`}
      >
        {children}
      </body>
    </html>
  );
}