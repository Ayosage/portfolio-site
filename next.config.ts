import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { execSync } from 'node:child_process'
import { resolveBuildHash } from './src/lib/build-info'

let gitShort: string | null = null
try {
  gitShort = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim()
} catch {}
const hash = resolveBuildHash({ gitShort, vercelSha: process.env.VERCEL_GIT_COMMIT_SHA })

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  env: {
    NEXT_PUBLIC_BUILD_HASH: hash,
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
}
export default createMDX()(nextConfig)
