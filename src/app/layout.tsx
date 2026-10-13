import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Navbar } from "@/components/Navbar";
import { MotionProvider } from "@/components/Motion";
import { BackToTop, CursorGlow, CustomCursor, ScrollProgress } from "@/components/Effects";
import { Footer } from "@/sections/Contact";
import { VisitTracker } from "@/components/VisitTracker";
import { BootIntro } from "@/components/BootIntro";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ButtonRipple } from "@/components/Ripple";
import { GsapSetup } from "@/components/gsap/GsapSetup";
import { HoverFX } from "@/components/gsap/HoverFX";
import { PageTransition } from "@/components/gsap/PageTransition";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = "Pramoth S | Product Development Engineer | Robotics & AI";
const description =
  "Portfolio of Pramoth S — Product Development Engineer working across ROS 2 robotics, embedded systems, computer vision, AI/ML, IoT, and product design.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url || "http://localhost:3005"),
  title: { default: title, template: "%s | Pramoth S" },
  description,
  keywords: [
    "Pramoth S", "Product Development Engineer", "ROS 2", "Robotics", "Nav2", "SLAM", "Embedded Systems",
    "ESP32", "Computer Vision", "YOLO", "AI", "Machine Learning", "IoT", "Product Design",
  ],
  authors: [{ name: "Pramoth S", url: site.github.url }],
  ...(site.url ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "Pramoth S",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070908",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pramoth S",
  jobTitle: "Product Development Engineer",
  ...(site.url ? { url: site.url } : {}),
  email: `mailto:${site.email}`,
  sameAs: [site.github.url, site.linkedin],
  worksFor: {
    "@type": "Organization",
    name: "Scrapify Ecotech Pvt Ltd",
    address: "iTNT Hub, Anna University, Guindy, Chennai",
  },
  knowsAbout: ["ROS 2", "Robotics", "Embedded Systems", "Computer Vision", "Machine Learning", "Product Design"],
  alumniOf: { "@type": "EducationalOrganization", name: "Meenakshi Sundararajan Engineering College" },
  address: { "@type": "PostalAddress", addressLocality: "Chennai", addressCountry: "IN" },
  knowsLanguage: ["ta", "en"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          <style>{`.hero-pending{visibility:visible!important}`}</style>
        </noscript>
        <MotionProvider>
          <BootIntro />
          <GsapSetup />
          <SmoothScroll />
          <PageTransition />
          <ButtonRipple />
          <HoverFX />
          <ScrollProgress />
          <CursorGlow />
          <CustomCursor />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <BackToTop />
          <VisitTracker />
        </MotionProvider>
      </body>
    </html>
  );
}
