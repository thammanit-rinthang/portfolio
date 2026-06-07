import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";
import { ChatLauncher } from "./_components/chat-launcher";
import { LocaleProvider } from "./_lib/locale-context";
import { ui } from "./_lib/locale";
import { getPublishedProfile } from "./_lib/data";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: ui.metadata.home.title.en,
    template: `%s | ${ui.metadata.home.title.en.split(" | ")[0]}`,
  },
  description: ui.metadata.home.description.en,
  openGraph: {
    title: ui.metadata.home.title.en,
    description: ui.metadata.home.description.en,
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getPublishedProfile().catch(() => null);

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider initialLocale="en">
          <SiteHeader profile={profile} />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <ChatLauncher />
        </LocaleProvider>
      </body>
    </html>
  );
}
