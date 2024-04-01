import './blog/[slug]/blog.css'

import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { Suspense } from 'react'

import { Footer } from '~/app/[locale]/(main)/Footer'
import { Header } from '~/app/[locale]/(main)/Header'
import { QueryProvider } from '~/app/[locale]/QueryProvider'

export default function BlogLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {

   // Receive messages provided in `i18n.ts`
   const messages = useMessages();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 select-none bg-[url('/grid-black.svg')] bg-top bg-repeat dark:bg-[url('/grid.svg')]" />
      <span className="pointer-events-none fixed top-0 block h-[800px] w-full select-none bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(5,5,5,0.045)_0%,rgba(0,0,0,0)_100%)] dark:bg-[radial-gradient(103.72%_46.58%_at_50%_0%,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-zinc-50/90 ring-1 ring-zinc-100 dark:bg-zinc-900/80 dark:ring-zinc-400/20" />
        </div>
      </div>

      <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <div className="relative text-zinc-800 dark:text-zinc-200">
          <Header/>
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </div>
      </QueryProvider>

      <Analytics />
        </NextIntlClientProvider>
    </>
  )
}
