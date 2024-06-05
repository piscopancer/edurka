import * as jose from 'jose'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { type Token } from './auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  let token = request.cookies.get('auth')?.value
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
  if (!token) return
  try {
    const verifiedToken = (await jose.jwtVerify(token, secret)).payload as Token
    const refreshedToken = await new jose.SignJWT({ id: verifiedToken.id } as Token)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('3d')
      .sign(secret)
    response.cookies.set('auth', refreshedToken, {
      httpOnly: true,
      secure: true,
    })
  } catch (error) {
    console.warn(error)
  }
  return response
}
