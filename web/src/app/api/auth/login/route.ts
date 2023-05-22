import { NextResponse } from 'next/server'

export async function GET() {
  const redirectUrl = `${process.env.NEXT_PUBLIC_GITHUB_LOGIN_URL}?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`
  return NextResponse.redirect(redirectUrl)
}
