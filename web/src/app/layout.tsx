import { Blur, Copyright, Hero, Profile, SignIn, Stripes } from '@/components'
import {
  Bai_Jamjuree as BaiJamjuree,
  Roboto_Flex as Roboto,
} from 'next/font/google'
import { cookies } from 'next/headers'
import { ReactNode } from 'react'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo escrita com React, Next.js, TailwindCSS e TypeScript',
}

const bgStars = 'bg-[url(../assets/bg-stars.svg)]'

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <main className="grid min-h-screen grid-cols-2">
          {/* Left */}
          <div
            className={`relative flex flex-col items-start justify-between overflow-hidden border-r border-white/10 ${bgStars} bg-cover px-28 py-16`}
          >
            <Blur />
            <Stripes />
            {isAuthenticated ? <Profile /> : <SignIn />}
            <Hero />
            <Copyright />
          </div>
          {/* Right */}

          <div
            className={`flex max-h-screen flex-col overflow-y-scroll ${bgStars} bg-cover`}
          >
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
