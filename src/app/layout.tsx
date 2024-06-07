import '@/assets/style.scss'
import { queryClient } from '@/query'
import { QueryClientProvider } from '@tanstack/react-query'
import clsx from 'clsx'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={clsx(GeistSans.variable, GeistMono.variable, 'flex min-h-dvh flex-col bg-zinc-200 font-sans')}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  )
}
