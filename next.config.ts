import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import { execSync } from 'node:child_process'

let hash = 'dev'
try {
  hash = execSync('git rev-parse --short HEAD').toString().trim()
} catch {}

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  env: {
    NEXT_PUBLIC_BUILD_HASH: hash,
    NEXT_PUBLIC_BUILD_TIME: String(Date.now()),
  },
}
export default createMDX()(nextConfig)
