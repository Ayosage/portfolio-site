import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Chassis } from '@/components/chassis/Chassis'
import { siteMetadata } from '@/lib/site'
import './globals.css'

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = siteMetadata

// Static hardcoded string — no user input ever flows into this
// dangerouslySetInnerHTML; it exists solely to set data-theme pre-paint.
const themeBoot = `(function(){try{var t=localStorage.getItem('bs01-theme');var v=['green','amber','paper'];if(v.indexOf(t)<0){t='green'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='green'}})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mono.variable}>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <Chassis>{children}</Chassis>
      </body>
    </html>
  )
}
