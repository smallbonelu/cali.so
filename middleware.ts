import { authMiddleware } from '@clerk/nextjs'
import { get } from '@vercel/edge-config'
import { type NextFetchEvent, type NextMiddleware, type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware';

import { kvKeys } from '~/config/kv'
import { defaultLocale, locales } from '~/config/locales'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

const publicRoutes = [
  '/',
  '/api(.*)',
  '/blog(.*)',
  '/confirm(.*)',
  '/projects',
  '/guestbook',
  '/newsletters(.*)',
  '/about',
  '/rss',
  '/feed',
  '/ama',
]
export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

function chain(functions: MiddlewareFactory[] = [], index = 0): NextMiddleware {
  const current = functions[index]

  if (current) {
    const next = chain(functions, index + 1)
    return current(next)
  }

  return () => NextResponse.next()
}

const localeMiddleware: MiddlewareFactory = () => {
  return (req: NextRequest, _next: NextFetchEvent) => {
    const publicPathnameRegex = RegExp(
      `^(/(${locales.join('|')}))?(${publicRoutes
        .flatMap((p) => (p === '/' ? ['', '/'] : p))
        .join('|')})/?$`,
      'i'
    );
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
      const middleware = createMiddleware({
        // A list of all locales that are supported
        locales,

        // Used when no locale matches
        defaultLocale,

        // 默认语言不重定向
        localePrefix: 'as-needed',
      });

      return middleware(req);
    } else {
      return NextResponse.next();
    }
  }
}


async function beforeAuthMiddleware(req: NextRequest) {
  const { geo, nextUrl } = req
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (process.env.EDGE_CONFIG) {
    const blockedIPs = await get<string[]>('blocked_ips')
    const ip = getIP(req)

    if (blockedIPs?.includes(ip)) {
      if (isApi) {
        return NextResponse.json(
          { error: 'You have been blocked.' },
          { status: 403 }
        )
      }

      nextUrl.pathname = '/blocked'
      return NextResponse.rewrite(nextUrl)
    }

    if (nextUrl.pathname === '/blocked') {
      nextUrl.pathname = '/'
      return NextResponse.redirect(nextUrl)
    }
  }

  if (geo && !isApi && env.VERCEL_ENV === 'production') {
    const country = geo.country
    const city = geo.city

    const countryInfo = countries.find((x) => x.cca2 === country)
    if (countryInfo) {
      const flag = countryInfo.flag
      await redis.set(kvKeys.currentVisitor, { country, city, flag })
    }
  }

  return NextResponse.next()
}

export default chain([
  localeMiddleware,
  () =>
    authMiddleware({
      beforeAuth: beforeAuthMiddleware,
      publicRoutes,
    })
])
