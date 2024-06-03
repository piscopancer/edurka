import "@/assets/style.scss"
import clsx from "clsx"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(GeistSans.variable, GeistMono.variable, "font-sans bg-zinc-200 flex flex-col min-h-dvh")}>{children}</body>
    </html>
  )
}
