import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const redirectTo = request.cookies.get('redirectTo')?.value

  const userResponse = await api.post('/user', { code })

  const { token } = userResponse.data

  const redirectUrl = redirectTo ??   new URL('/', request.url)

  const expiresIn = 60 * 60 * 24 * 30 // 30 dias em segundos

  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; Max-Age=${expiresIn};`,
    },
  })
}
