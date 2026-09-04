import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Chassis } from '@/components/chassis/Chassis'
import { siteMetadata } from '@/lib/site'
import { bootScript } from '@/lib/boot'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = siteMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.variable}>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <Chassis>{children}</Chassis>
      </body>
    </html>
  )
}
