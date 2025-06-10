import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job-CV-Manager - Free Resume Builder & Career Opportunities",
  description:
    "Create professional, ATS-friendly resumes and explore career opportunities for free. No watermarks, no hidden fees. AI-powered resume builder with modern templates and job management tools.",
  keywords:
    "resume builder, cv maker, free resume, ATS-friendly resume, AI resume builder, professional templates, career tools, job manager, job opportunities, job board",
  authors: [{ name: "Divyanshu Bhandari Team" }],
  creator: "Job-CV-Manager",
  publisher: "Job-CV-Manager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://job-cv-manager.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Job-CV-Manager - Free Resume Builder & Career Opportunities",
    description:
      "Build ATS-friendly resumes and find new career opportunities. 100% free, open source, and AI-powered for modern job seekers.",
    url: "https://job-cv-manager.vercel.app",
    siteName: "Job-CV-Manager",
    images: [
      {
        url: "/assets/ss.png",
        width: 1200,
        height: 630,
        alt: "Job-CV-Manager Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job-CV-Manager - Free Resume Builder & Career Tools",
    description:
      "Create professional resumes and discover career opportunities with this open source, AI-powered builder. Free forever.",
    images: ["/assets/ss.png"],
    creator: "@jobcvmanager",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ",
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="IVOjL--iVz33j73JnMvQT2vZsRoEje6C9GQGxF8BlxQ"
        />
        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebApplication",
              name: "Job-CV-Manager",
              description:
                "Create professional, ATS-friendly resumes and explore career opportunities. Free, open-source, AI-powered resume builder with modern templates and job tracking tools.",
              url: "https://job-cv-manager.vercel.app",
              applicationCategory: "Resume Builder, Career Platform",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Job-CV-Manager",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
